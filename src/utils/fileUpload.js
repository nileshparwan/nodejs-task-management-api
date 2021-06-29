const multer = require('multer'); //

const uploadAvatar = multer(
    {
        // dest: 'public/images/avatars',
        limits: {
            fileSize: 1000000
        },
        fileFilter(req, file, cb) {
            const fileName = file.originalname;
            if (!fileName.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Please upload an image'));
            }

            cb(undefined, true);

            // error
            // cb(new Error('File must be a PDF'));

            // success
            // cb(undefined, true);

            // reject upload
            // cb(undefined, false);
        },
    }
);

// const uploadDocument = multer(
//     {
//         dest: 'public/documents', // commenting this line allows us to get the file properties from the router
//         limits: {
//             fileSize: 1000000
//         },
//         fileFilter(req, file, cb) {
//             const fileName = file.originalname;
//             if (!fileName.match(/\.(doc|docx|pdf)$/)) {
//                 return cb(new Error('Please upload a proper document'));
//             }

//             cb(undefined, true);

//             // error
//             // cb(new Error('File must be a PDF'));

//             // success
//             // cb(undefined, true);

//             // reject upload
//             // cb(undefined, false);
//         },
//     }
// );

module.exports = {
    uploadAvatar,
    // uploadDocument
};