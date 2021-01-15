import multer from 'multer';
import jimp from 'jimp';
import { v4 as uuid } from 'uuid';

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter: (req, file, next) => {
        const allowed = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

        if (allowed.includes(file.mimetype)) {
            next(null, true);
        } else {
            next({message: 'Arquivo não suportado'}, false);
        }
    }
};

const imageMiddleware = {
    upload: multer(multerOptions).single('photo'),
    resize: async (req, res, next) => {
        if (!req.file) {
            next();
            return;
        }
        
        const ext = req.file.mimetype.split('/')[1];
        let filename = `${uuid()}.${ext}`;
        req.body.photo = filename;
        
        const photo = await jimp.read(req.file.buffer);
        await photo.resize(800, jimp.AUTO);
        await photo.write(`./public/media/${filename}`);
        
        next();
    }
};

export default imageMiddleware;
