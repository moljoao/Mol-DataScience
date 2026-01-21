// ==========================================
// CONFIGURAÇÃO SUPABASE
// ==========================================
const SUPABASE_URL = 'https://dylzxedhdpygqtosvhit.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHp4ZWRoZHB5Z3F0b3N2aGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MzM0MjUsImV4cCI6MjA4NDAwOTQyNX0.d2s44FVdJ4MT2iaRBpG-dZK0FoG64UxKq8L0JI7Q9oU';

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

const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userAvatar = document.getElementById('userAvatar');
const logoutBtn = document.getElementById('logoutBtn');
const pageTitle = document.getElementById('pageTitle');
const sidebarLinks = document.querySelectorAll('.sidebar-menu a');

// ==========================================
// VERIFICAR AUTENTICAÇÃO
// ==========================================
async function checkAuth() {
    const adminUserId = localStorage.getItem('adminUserId');
    
    if (!adminUserId) {
        // Usuário não logado, redirecionar para login
        console.log('Nenhum usuário logado - redirecionando para login');
        window.location.href = 'admin_login.html';
        return null;
    }

    return adminUserId;
}

// ==========================================
// CARREGAR DADOS DO USUÁRIO
// ==========================================
async function loadUserData() {
    const adminUserId = await checkAuth();
    
    if (!adminUserId) return;

    try {
        // Buscar dados do admin na tabela admin_users pelo ID
        const { data: adminData, error } = await window.supabaseClient
            .from('admin_users')
            .select('email, nome')
            .eq('id', adminUserId)
            .single();

        if (error) {
            console.error('Erro ao buscar dados do admin:', error);
            return;
        }

        const email = adminData?.email || localStorage.getItem('adminUserEmail') || 'admin@example.com';
        const name = adminData?.nome || localStorage.getItem('adminUserName') || email.split('@')[0];
        const initials = name.charAt(0).toUpperCase();

        userName.textContent = name;
        userEmail.textContent = email;
        userAvatar.textContent = initials;
        userAvatar.style.cursor = 'pointer';

        console.log('Dados do usuário carregados:', { name, email });

        // Clique no avatar para editar perfil (preparado para expansão futura)
        userAvatar.addEventListener('click', () => {
            console.log('Editar perfil do usuário');
        });
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

// ==========================================
// NAVEGAÇÃO ENTRE SEÇÕES
// ==========================================
const sections = {
    dashboard: {
        title: 'Dashboard',
        element: document.getElementById('dashboardSection')
    },
    users: {
        title: 'Gerenciamento de Usuários',
        element: document.getElementById('usersSection')
    },
    settings: {
        title: 'Configurações',
        element: document.getElementById('settingsSection')
    }
};

function showSection(sectionName) {
    // Esconder todas as seções
    Object.values(sections).forEach(section => {
        section.element.style.display = 'none';
    });

    // Remover classe active de todos os links
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Mostrar seção selecionada
    if (sections[sectionName]) {
        sections[sectionName].element.style.display = 'block';
        pageTitle.textContent = sections[sectionName].title;

        // Marcar link como ativo
        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Event listeners para navegação
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        showSection(section);
    });
});

// ==========================================
// LOGOUT
// ==========================================
logoutBtn.addEventListener('click', async () => {
    try {
        // Apenas remover dados locais, pois usamos localStorage
        localStorage.removeItem('adminUserId');
        localStorage.removeItem('adminUserEmail');
        localStorage.removeItem('adminUserName');
        
        window.location.href = 'admin_login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
});

// ==========================================
// INICIALIZAÇÃO
// ==========================================
window.addEventListener('load', () => {
    loadUserData();
    showSection('dashboard');
});
