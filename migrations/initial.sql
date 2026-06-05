-- 1. Tabela de Grupos/Famílias
CREATE TABLE grupos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo_acesso VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Tabela de Membros/Integrantes
CREATE TABLE membros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    cor VARCHAR(7) DEFAULT '#4f46e5',
    role VARCHAR(20) DEFAULT 'member', -- 'admin' ou 'member'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabela de Tarefas/Atividades
CREATE TABLE tarefas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
    module VARCHAR(20) NOT NULL, -- 'tarefas' ou 'calendario'
    descricao TEXT NOT NULL,
    assigned_to UUID REFERENCES membros(id) ON DELETE CASCADE,
    created_by UUID REFERENCES membros(id) ON DELETE SET NULL,
    recurrence VARCHAR(20) DEFAULT 'once', -- 'once', 'daily', 'weekly', 'monthly'
    days INT[] DEFAULT '{}', -- Array de inteiros para os dias [1,3,5] ou [10,25]
    start_date DATE NOT NULL,
    start_time TIME NULL, -- Nulo para tarefas domésticas
    end_time TIME NULL,   -- Nulo para tarefas domésticas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabela de Histórico de Conclusão (Substitui o array completedDates)
CREATE TABLE tarefas_concluidas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tarefa_id UUID REFERENCES tarefas(id) ON DELETE CASCADE,
    data_conclusao DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(tarefa_id, data_conclusao) -- Impede duplicidade no mesmo dia
);