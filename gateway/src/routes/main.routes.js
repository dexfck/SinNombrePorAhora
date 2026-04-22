import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando correctamente con ES Modules' });
});

export default router;
