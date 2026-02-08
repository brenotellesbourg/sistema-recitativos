// 1. CONFIGURAÇÃO
const SUPABASE_URL = 'https://yyktessyxnloyjwmydoj.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5a3Rlc3N5eG5sb3lqd215ZG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzNDQ1NzUsImV4cCI6MjA4NTkyMDU3NX0.bvktQ_DFH-CIszOlL0j1vrlIRM5sW3DIamjUy2fT__g';

const clienteSupabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. LÓGICA DE LOGIN INTELIGENTE
const formLogin = document.getElementById('form-login');

formLogin.addEventListener('submit', async function(evento) {
    evento.preventDefault(); 

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const btn = document.getElementById('btn-entrar');

    btn.textContent = "Verificando...";
    btn.disabled = true;

    try {
        // A. LOGIN (Email e Senha batem?)
        const { data: dataAuth, error: errorAuth } = await clienteSupabase.auth.signInWithPassword({
            email: email,
            password: senha,
        });

        if (errorAuth) throw errorAuth;

        // B. QUEM É VOCÊ? (Busca Função e Gênero na tabela profiles)
        const userId = dataAuth.user.id;
        
        const { data: dataPerfil, error: errorPerfil } = await clienteSupabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single(); // Traz apenas 1 resultado

        if (errorPerfil) throw errorPerfil;

        // C. SALVA NO CRACHÁ (Memória do Navegador)
        localStorage.setItem('usuario_id', userId);
        localStorage.setItem('usuario_email', email);
        localStorage.setItem('usuario_genero', dataPerfil.genero);
        localStorage.setItem('usuario_funcao', dataPerfil.funcao); // <--- O Segredo!

        console.log("Perfil Carregado:", dataPerfil);

        // D. O GRANDE DESVIO (A Lógica de Tráfego)
        if (dataPerfil.funcao === 'ADMIN') {
            // Se for Chefe, vai pra cozinha
            alert("Acesso Administrativo Confirmado.");
            window.location.href = 'admin.html'; 
        } else {
            // Se for Membro, vai pro salão
            alert("Login Confirmado.");
            window.location.href = 'painel.html'; 
        }

    } catch (erro) {
        alert("Erro: " + erro.message);
        console.error(erro);
    } finally {
        btn.textContent = "Entrar";
        btn.disabled = false;
    }
});