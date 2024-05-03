const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-ctr';
let key = 'MySecretKey';
key = crypto.createHash('sha256').update(String(key)).digest('base64').substring(0, 32);

//encrypt function
const encrypt = (buffer) => {
    //create initialization vector
    const iv = crypto.randomBytes(16);

    //create a new cipher using the algorithm, key, iv
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    //create the new encrypted buffer
    const res = Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
    return res;
}

//decrypt function
const decrypt = (encrypted) => {
    //get the iv (the first 16 bytes)
    const iv = encrypted.slice(0, 16);

    //get the rest
    encrypted = encrypted.slice(16);

    //create decipher
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    
    //decrypt it
    const res = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return res;
}

//JALANIN SATU FS AJA, YANG LAIN DIKOMEN
//buat encrypt
fs.readFile('./myFile.txt', (err, file) => {
    if(err) return console.error(err.message);

    console.log('Current File Data: ${file}');

    //encrypt the file data
    const encryptedFile = encrypt(file);

    //flow the encrypted file data to the new file
    fs.writeFile('./cipher_file.txt', encryptedFile, (err, file) =>{
        if(err) return console.error(err.message);

        if(file) {
            console.log('File Encrypted');
        }
    })
})

//buat decrypt
fs.readFile('./cipher_file.txt', (err, file) => {
    if(err) return console.error(err.message);

    //decrypt the file
    if(file) {
        const decryptedFile = decrypt(file);
        console.log(decryptedFile.toString());
    }
})