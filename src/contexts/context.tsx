import React, { useState, createContext, ReactNode } from 'react';

interface GlobalProviderProps {
    children: ReactNode;
}

interface ModalProps {
    isOpen: boolean,
    title?: string,
    text?: string,
    type?: 'default' | 'information' | 'question',
}

interface UsuarioLogado {
    codigo: number,
    login: string,
    nome: string,
    perfil: string,
    codigo_professor?: number,
}

interface Codigo_Descricao {
    codigo: number,
    descricao?: string,
}

interface GlobalContextData {
    isLogger: boolean;
    alterLogin: (value: boolean) => void;

    sidebar: boolean;
    alterSidebar: (value: boolean) => void;

    aux: number;
    alterAux: (value: number) => void;

    modalProps: ModalProps;
    alterModalProps: (value: ModalProps) => void;

    usuarioLogado: UsuarioLogado;
    alterUsuarioLogado: (value: UsuarioLogado) => void;

    cidade: number;
    alterCidade: (value: number) => void;

    aluno: number;
    alterAluno: (value: number) => void;

    professor: number;
    alterProfessor: (value: number) => void;

    escola: number;
    alterEscola: (value: number) => void;

    nivel_de_ensino : number;
    alterNivel_de_ensino : (value : number) => void;

    serie : number;
    alterSerie : (value : number) => void;

    turma : number;
    alterTurma : (value : number) => void;

    disciplina : number;
    alterDisciplina : (value : number) => void;

    disciplinas_da_turma : number;
    alterDisciplinas_da_turma : (value : number) => void;

    matricula : number;
    alterMatricula : (value : number) => void;

    v_matriculas : number;
    alterV_matriculas : (value : number) => void;

    boletim : number;
    alterBoletim : (value : number) => void;

    v_boletins : number;
    alterV_boletins : (value : number) => void;
    
    disciplinas_boletim : number;
    alterDisciplinas_boletim : (value : number) => void;

    v_disciplinas_turma : Codigo_Descricao;
    alterV_disciplinas_turma : (value : Codigo_Descricao) => void;

    dias_letivos : number;
    alterDias_letivos : (value : number) => void;

    usuario : number;
    alterUsuario : (value : number) => void;

}


export const GlobalContext = createContext({} as GlobalContextData);

export function GlobalProvider({ children }: GlobalProviderProps) {
    const [user, setUser] = useState({ logger: false });
    const isLogger = user.logger;

    const [modalProps, setModalProps] = useState<ModalProps>({ isOpen: false });
    const [sidebar, setSidebar] = useState(false);
    const [aux, setAux] = useState(0);
    const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLogado>({codigo:0, login:'', nome:'', perfil:''})
    const [cidade, setCidade] = useState(0);
    const [aluno, setAluno] = useState(0);
    const [professor, setProfessor] = useState(0);
    const [escola, setEscola] = useState(0);
    const [nivel_de_ensino, setNivel_de_ensino] = useState(0);
    const [serie, setSerie] = useState(0);
    const [turma, setTurma] = useState(0);
    const [disciplina, setDisciplina] = useState(0);
    const [disciplinas_da_turma, setDisciplinas_da_turma] = useState(0);
    const [matricula, setMatricula] = useState(0);
    const [v_matriculas, setV_matriculas] = useState(0);
    const [boletim, setBoletim] = useState(0);
    const [v_boletins, setV_boletins] = useState(0);
    const [disciplinas_boletim, setDisciplinas_boletim] = useState(0);
    const [v_disciplinas_turma, setV_disciplinas_turma] = useState<Codigo_Descricao>({codigo:0, descricao: ''})
    const [dias_letivos, setDias_letivos] = useState(0);
    const [usuario, setUsuario] = useState(0);

    function alterUsuario(value : number){
        setUsuario(value);
    }

    function alterUsuarioLogado(value: UsuarioLogado){
        setUsuarioLogado(value);
    }
    function alterV_disciplinas_turma(value : Codigo_Descricao){
        setV_disciplinas_turma(value);
    }

    function alterDisciplinas_boletim(value : number){
        setDisciplinas_boletim(value);
    }

    function alterV_matriculas(value : number){
        setV_matriculas(value);
    }

    function alterBoletim(value : number){
        setBoletim(value);
    }

    function alterV_boletins(value : number){
        setV_boletins(value);
    }

    function alterMatricula(value : number){
        setMatricula(value);
    }

    function alterDisciplinas_da_turma(value : number){
        setDisciplinas_da_turma(value);
    }

    function alterDisciplina(value : number){
        setDisciplina(value);
    }

    function alterTurma(value : number){
        setTurma(value);
    }

    function alterSerie(value : number){
        setSerie(value);
    }
    
    function alterNivel_de_ensino(value : number){
        setNivel_de_ensino(value);
    }

    function alterEscola(value: number) {
        setEscola(value);
    }

    function alterLogin(value: boolean) {
        setUser({ ...user, logger: value });
    }

    function alterSidebar(value: boolean) {
        setSidebar(value);
    }

    function alterAux(value: number) {
        setAux(value);
    }

    function alterModalProps(value: ModalProps) {
        setModalProps(value);
    }

    function alterCidade(value: number) {
        setCidade(value);
    }

    function alterAluno(value: number) {
        setAluno(value);
    }

    function alterProfessor(value: number) {
        setProfessor(value);
    }

    function alterDias_letivos(value : number){
        setDias_letivos(value);
    }


    return (
        <GlobalContext.Provider value={{
            isLogger, alterLogin,
            modalProps, alterModalProps, 
            aux, alterAux, 
            sidebar, alterSidebar,
            usuarioLogado, alterUsuarioLogado,
            cidade, alterCidade, 
            aluno, alterAluno, 
            professor, alterProfessor,
            escola, alterEscola,
            nivel_de_ensino, alterNivel_de_ensino,
            serie, alterSerie,
            turma, alterTurma,
            disciplina, alterDisciplina,
            disciplinas_da_turma, alterDisciplinas_da_turma,
            matricula, alterMatricula,
            boletim, alterBoletim,


            v_matriculas, alterV_matriculas,
            v_boletins, alterV_boletins,
            disciplinas_boletim, alterDisciplinas_boletim,
            v_disciplinas_turma, alterV_disciplinas_turma,
            dias_letivos, alterDias_letivos,
            usuario, alterUsuario


        }}>
            {children}
        </GlobalContext.Provider>
    );

}