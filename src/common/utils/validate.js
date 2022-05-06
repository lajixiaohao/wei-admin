/**
 * 验证账号
 **/
export function validateAccount (str) { return /^[a-zA-Z][a-zA-Z0-9_]{4,19}$/.test(str) }

/**
 * 验证密码
 **/
export function validatePassword (str) { return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/.test(str) }

/**
 * 验证姓名
 **/
export function validateTrueName (str) { return /^.{2,20}$/.test(str) }
