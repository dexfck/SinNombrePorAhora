import {Router} from "express"
import {decodeJWT} from "../utils/jwtHelper.js"
import {supabase} from "../utils/supabase.js"

const router = Router()

router.post("/", async (req, res) => {
    try {
        const response = await fetch(
            "https://client-api-gateway.unphusist.unphu.edu.do/student-login/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(req.body),
            },
        )

        const responseData = await response.json();
        
        if (response.ok) {
            const token = responseData.data?.token?.token;
            const fullData = decodeJWT(token);
            
            if (!fullData) {
                return res.status(500).json({
                    message: "No se pudo obtener el token o el formato es inválido",
                    received: responseData
                });
            }

            const userData = {
                gateway_id: fullData.user?.id.toString(), 
                display_name: fullData.user?.names,
                username: fullData.user?.username,
                email: fullData.user?.email,
                career: fullData.user?.career,
                enclosure: fullData.user?.enclosure,
                enrollment: fullData.user?.enrollment,
                user_type: fullData.user?.userType,
                last_login: new Date().toISOString()
            };

            const { data: dbUser, error: dbError } = await supabase
                .from('profiles')
                .upsert(userData, { onConflict: 'gateway_id' })
                .select()
                .single();

            if (dbError) {
                console.error("Error sincronizando usuario con Supabase:", dbError);
            }

            res.status(200).json({
                ...userData,
                db_id: dbUser?.id, 
                token: token
            });
        } else {
            res.status(response.status).json(responseData);
        }

    } catch (error) {
        console.error("Error al procesar la solicitud de login:", error)
        res.status(500).json({
            message: "Error de conexión con el servidor de autenticación",
            error: error.message,
        })
    }
})

export default router
