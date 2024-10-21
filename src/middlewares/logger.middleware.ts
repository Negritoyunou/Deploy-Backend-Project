import { NextFunction, Response } from 'express';
export function LoggerGlobal(req: Request, res: Response, next: NextFunction ) {
    const fechaActual = new Date()
        console.log(`Estas ejecutando un metodo ${req.method} en la ruta ${req.url}, a la hora ${fechaActual}`,

        );
        next();
};