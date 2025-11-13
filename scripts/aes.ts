import crypto from 'crypto';
import {ivHex, keyHex} from "./config";
import fs from "node:fs";

type BufferEncoding =
    'ascii' | 'utf8' | 'utf-8' | 'utf16le' |
    'ucs2' | 'ucs-2' | 'base64' | 'base64url' |
    'latin1' | 'binary' | 'hex';

/**
 * 使用 AES-CBC 模式加密数据
 * @param plaintext 要加密的明文（字符串或 Buffer）
 * @param key 加密密钥（必须为 Buffer，长度：AES-128:16字节, AES-192:24字节, AES-256:32字节）
 * @param iv 初始化向量（必须为 16 字节 Buffer）
 * @param inputEncoding 输入文本编码（默认为 'utf-8'）
 * @param outputEncoding 输出编码（默认为 'base64'）
 * @returns 加密后的密文
 */
export function encryptAesCbc(
    plaintext: string | Buffer,
    key: Buffer,
    iv: Buffer,
    inputEncoding: BufferEncoding = 'utf-8',
    outputEncoding: BufferEncoding = 'base64'
): string {
    // 验证参数类型
    if (!Buffer.isBuffer(key)) throw new Error('Key must be a Buffer');
    if (!Buffer.isBuffer(iv)) throw new Error('IV must be a Buffer');

    // 验证密钥长度
    if (![16, 24, 32].includes(key.length)) {
        throw new Error(`Invalid key length: ${key.length} bytes. Must be 16, 24 or 32 bytes for AES`);
    }

    // 验证IV长度
    if (iv.length !== 16) {
        throw new Error(`Invalid IV length: ${iv.length} bytes. Must be 16 bytes for AES-CBC`);
    }

    // 创建加密器
    const cipher = crypto.createCipheriv(`aes-${key.length * 8}-cbc`, key, iv);

    // 处理输入数据
    const inputBuffer = typeof plaintext === 'string'
        ? Buffer.from(plaintext, inputEncoding)
        : plaintext;

    // 加密数据
    const encrypted = Buffer.concat([
        cipher.update(inputBuffer),
        cipher.final()
    ]);

    return encrypted.toString(outputEncoding);
}

/**
 * 使用 AES-CBC 模式解密数据
 * @param ciphertext 要解密的密文（字符串或 Buffer）
 * @param key 解密密钥（必须为 Buffer）
 * @param iv 初始化向量（必须为 16 字节 Buffer）
 * @param inputEncoding 输入文本编码（默认为 'base64'）
 * @param outputEncoding 输出编码（默认为 'utf-8'）
 * @returns 解密后的明文
 */
export function decryptAesCbc(
    ciphertext: string | Buffer,
    key: Buffer,
    iv: Buffer,
    inputEncoding: BufferEncoding = 'base64',
    outputEncoding: BufferEncoding = 'utf-8'
): string {
    // 验证参数类型
    if (!Buffer.isBuffer(key)) throw new Error('Key must be a Buffer');
    if (!Buffer.isBuffer(iv)) throw new Error('IV must be a Buffer');

    // 验证密钥长度
    if (![16, 24, 32].includes(key.length)) {
        throw new Error(`Invalid key length: ${key.length} bytes. Must be 16, 24 or 32 bytes for AES`);
    }

    // 验证IV长度
    if (iv.length !== 16) {
        throw new Error(`Invalid IV length: ${iv.length} bytes. Must be 16 bytes for AES-CBC`);
    }

    // 处理输入数据
    const inputBuffer = typeof ciphertext === 'string'
        ? Buffer.from(ciphertext, inputEncoding)
        : ciphertext;

    // 创建解密器
    const decipher = crypto.createDecipheriv(`aes-${key.length * 8}-cbc`, key, iv);

    // 解密数据
    const decrypted = Buffer.concat([
        decipher.update(inputBuffer),
        decipher.final()
    ]);

    return decrypted.toString(outputEncoding);
}

/**
 * 测试 AES-CBC 加密解密功能
 */
function testAesCbc() {
    try {
        // 1. 生成密钥和IV
        const key = Buffer.from(keyHex, 'hex'); // AES-256
        const iv = Buffer.from(ivHex, 'hex');
        console.log(`Key (hex): ${key.toString('hex')}`);
        console.log(`IV (hex): ${iv.toString('hex')}`);

        const ciphertext = fs.readFileSync('./entergame.txt', 'utf8');
        // 3. 解密验证
        const decryptedText = decryptAesCbc(ciphertext, key, iv);
        // console.log(`Decrypted text: ${decryptedText}`);

        fs.writeFileSync('./entergame.json', decryptedText);

        return true;
    } catch (error) {
        console.error('❌ AES-CBC 测试失败:', (error as Error).message);
        return false;
    }
}

// 执行测试
// testAesCbc();
