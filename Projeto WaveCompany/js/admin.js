// ==========================================
// ADMIN LOGIN - CONFIGURAÇÃO LIMPA
// ==========================================

// Esperar Supabase estar disponível
let supabase_client = null;

function waitForSupabase() {
    return new Promise((resolve) => {
        if (window.supabase && window.supabase.createClient) {
            const url = 'https://dylzxedhdpygqtosvhit.supabase.co';
            const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHp4ZWRoZHB5Z3F0b3N2aGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzM0MjUsImV4cCI6MjA4NDAwOTQyNX0.d2s44FVdJ4MT2iaRBpG-dZK0FoG64UxKq8L0JI7Q9oU';
            supabase_client = window.supabase.createClient(url, key);
            console.log('✓ Supabase inicializado');
            resolve(true);
        } else {
            setTimeout(() => waitForSupabase().then(resolve), 100);
        }
    });
}

// Aguardar Supabase antes de executar qualquer coisa
waitForSupabase().then(() => {
    console.log('✓ Sistema pronto para uso');
});

// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const rememberMeCheckbox = document.getElementById('rememberMe');
const loginBtn = document.getElementById('loginBtn');
const alertContainer = document.getElementById('alertContainer');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');

// ==========================================
// FUNÇÕES AUXILIARES
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
// TOGGLE PASSWORD
// ==========================================

togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    const icon = togglePasswordBtn.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

// ==========================================
// CHECK AUTH - Redirecionar se já logado
// ==========================================

function checkAuth() {
    const adminUserId = localStorage.getItem('adminUserId');
    if (adminUserId) {
        window.location.href = 'admin_dashboard.html';
    }
}

checkAuth();

// ==========================================
// LOGIN FORM SUBMIT
// ==========================================

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAlert();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showAlert('Por favor, preencha todos os campos.');
        return;
    }

    loginBtn.disabled = true;
    loginBtn.classList.add('loading');
    loginBtn.textContent = '';

    try {
        // Buscar usuário
        const { data: adminUser, error: userError } = await supabase_client
            .from('admin_users')
            .select('id, email, password_hash, nome');

        if (userError) {
            showAlert(`Erro ao buscar usuário: ${userError.message}`);
            return;
        }

        if (!adminUser || adminUser.length === 0) {
            showAlert('Email ou senha incorretos.');
            return;
        }

        // Procurar pelo email
        const user = adminUser.find(u => u.email === email);

        if (!user) {
            showAlert('Email ou senha incorretos.');
            return;
        }

        // Validar senha (comparação simples em texto plano)
        if (user.password_hash !== password) {
            showAlert('Email ou senha incorretos.');
            return;
        }

        // Login bem-sucedido
        showAlert('Login realizado com sucesso! Redirecionando...', 'success');

        // Salvar dados
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('rememberEmail', email);
        }
        localStorage.setItem('adminUserId', user.id);
        localStorage.setItem('adminUserEmail', email);
        localStorage.setItem('adminUserName', user.nome);

        // Redirecionar
        setTimeout(() => {
            window.location.href = 'admin_dashboard.html';
        }, 1500);

    } catch (error) {
        showAlert(`Erro: ${error.message}`);
    } finally {
        loginBtn.disabled = false;
        loginBtn.classList.remove('loading');
        loginBtn.textContent = 'Entrar';
    }
});

// ==========================================
// FORGOT PASSWORD
// ==========================================

forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    showAlert('Função de recuperação de senha em desenvolvimento.', 'warn');
});

// ==========================================
// PREENCHIMENTO AUTOMÁTICO
// ==========================================

window.addEventListener('load', () => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
        passwordInput.focus();
    }
});
