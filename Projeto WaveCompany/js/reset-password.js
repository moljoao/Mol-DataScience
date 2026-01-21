// ==========================================
// CONFIGURAÇÃO SUPABASE
// ==========================================
const SUPABASE_URL = 'https://dylzxedhdpygqtosvhit.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHp4ZWRoZHB1Z3F0b3N2aGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzM0MjUsImV4cCI6MjA4NDAwOTQyNX0.d2s44FVdJ4MT2iaRBpG-dZK0FoG64UxKq8L0JI7Q9oU';

// Declarar supabase apenas se não existir
if (typeof window.supabaseClient === 'undefined') {
    window.supabaseClient = null;
    
    function initSupabase() {
        if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
            window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✓ Supabase inicializado com sucesso');
            return true;
        } else {
            console.warn('Supabase JS library ainda não carregada');
            return false;
        }
    }
    
    // Tentar inicializar imediatamente
    if (!initSupabase()) {
        setTimeout(() => {
            if (!initSupabase()) {
                setTimeout(() => {
                    if (!initSupabase()) {
                        console.error('ERRO: Supabase JS library não foi carregada');
                    }
                }, 100);
            }
        }, 100);
    }
}

// Usar alias local para comodidade
// const supabase = window.supabaseClient; // Comentado para evitar conflito de declaração

const resetForm = document.getElementById('resetForm');
const newPasswordInput = document.getElementById('newPassword');
const confirmPasswordInput = document.getElementById('confirmPassword');
const togglePassword1Btn = document.getElementById('togglePassword1');
const togglePassword2Btn = document.getElementById('togglePassword2');
const resetBtn = document.getElementById('resetBtn');
const alertContainer = document.getElementById('alertContainer');

// ==========================================
// TOGGLE PASSWORD VISIBILITY
// ==========================================
togglePassword1Btn.addEventListener('click', () => {
    const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    newPasswordInput.setAttribute('type', type);
    const icon = togglePassword1Btn.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

togglePassword2Btn.addEventListener('click', () => {
    const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    confirmPasswordInput.setAttribute('type', type);
    const icon = togglePassword2Btn.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

// ==========================================
// SHOW/HIDE ALERT
// ==========================================
function showAlert(message, type = 'danger') {
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <strong>${type === 'danger' ? 'Erro!' : 'Sucesso!'}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

function clearAlert() {
    alertContainer.innerHTML = '';
}

// ==========================================
// CHECK RESET TOKEN
// ==========================================
async function checkResetToken() {
    const hash = window.location.hash;
    
    if (!hash) {
        showAlert('Link de recuperação inválido ou expirado.');
        resetBtn.disabled = true;
        return false;
    }

    // Verificar se há um token de reset válido
    const { data } = await supabase.auth.getSession();
    
    // Se não houver sessão, espera o usuário submeter o formulário para fazer update
    return true;
}

// ==========================================
// RESET PASSWORD HANDLER
// ==========================================
resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validações
    if (!newPassword || !confirmPassword) {
        showAlert('Por favor, preencha todos os campos.');
        return;
    }

    if (newPassword.length < 6) {
        showAlert('A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert('As senhas não correspondem.');
        return;
    }

    // Desabilitar botão e mostrar loading
    resetBtn.disabled = true;
    resetBtn.classList.add('loading');
    resetBtn.textContent = '';

    try {
        // Atualizar senha do usuário
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            // Tratamento de erros específicos
            if (error.message.includes('password')) {
                showAlert('Erro ao atualizar a senha. Tente novamente.');
            } else {
                showAlert(`Erro: ${error.message}`);
            }
            return;
        }

        // Sucesso
        showAlert('Senha atualizada com sucesso! Redirecionando para login...', 'success');

        // Redirecionar para login após 2 segundos
        setTimeout(() => {
            window.location.href = 'admin_login.html';
        }, 2000);

    } catch (error) {
        showAlert(`Erro inesperado: ${error.message}`);
    } finally {
        // Reabilitar botão
        resetBtn.disabled = false;
        resetBtn.classList.remove('loading');
        resetBtn.textContent = 'Atualizar Senha';
    }
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================
window.addEventListener('load', () => {
    checkResetToken();
});
