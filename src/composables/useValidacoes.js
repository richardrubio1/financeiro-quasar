export function useValidacoes() {

    function validarEmail(valor) {
        if (!valor) return 'O e-mail é obrigatório'
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
        return regex.test(valor) || 'E-mail inválido'
    }

    function validarSenha(valor) {
        if (!valor) return 'A senha é obrigatória'
        if (valor.length < 8) {
            return 'A senha deve ter pelo menos 8 caracteres'
        }
        if (!/[A-Z]/.test(valor) || !/[a-z]/.test(valor) || !/[0-9]/.test(valor)) {
            return 'A senha deve conter uma letra maiúscula, uma minúscula e um número'
        }
        return true
    }
    return {
        validarEmail,
        validarSenha
    }




}
