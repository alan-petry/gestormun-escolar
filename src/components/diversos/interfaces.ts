export interface ButtonDialogProps {
    textbutton : string,
    title : string,
    msg : string,
    action : () => void,
    type : 'default' | 'deleteIcon' | 'deleteButton' | 'information' ;
};

export interface DialogProps{
    type: 'info' | 'success' | 'error' | 'confirmation' , 
    msg: string, 
    title: string, 
    confirmBtnText?: string, 
    cancelBtnText?: string,
    id?: number,
}

export interface CidadeProps {
    CID_CODIGO : number,
    CID_NOME? : string,
    CID_UF? : string,
    CID_AIM? : string,
    CID_IBGE? : string,
}

export interface EscolaProps {
    ESC_CODIGO : number,
    CID_CODIGO? : string,
    ESC_NOME : string,
    ESC_ENDERECO? : string,
    ESC_CEP? : string,
    ESC_FONE? : string,
    ESC_LEMA? : string,
    ESC_INEP? : string,
    ESC_NOMEABREVIADO? : string,
}

export interface Nivel_de_ensinoProps {
    NIV_CODIGO : number,
    NIV_DESC? : string,
}

export interface AlunoProps {
    ALU_CODIGO : number,
    ALU_NOME? : string,
    ALU_NASCIMENTO?: number,
    ALU_ENDERECO?: string,
    ALU_FONE?: string,
    ALU_SITUACAO?: string,
    ALU_TRANSFERENCIA?: string,
    ALU_OBSERVACOES?: string,
}

export interface SerieProps {
    SER_CODIGO : number,
    NIV_CODIGO? : string,
    SER_DESC? : string,
    SER_SEQUENCIA? : string,
}

export interface TurmaProps {
    TUR_CODIGO : number,
    SER_CODIGO? : string,
    TUR_DESC? : string,
    TUR_ANO? : string,
    ESC_CODIGO?: number,
    ESC_NOME?: string,
    SER_DESC?: string,
}

export interface DisciplinaProps {
    DISC_CODIGO : number,
    DISC_DESC? : string,
}

export interface Disciplinas_da_turmaProps {
    DI_TUR_CODIGO : number,
    TUR_CODIGO? : string,
    DISC_CODIGO? : string,
    DISC_DESC? : string,
    PRO_CODIGO? : string,
    PRO_NOME? : string,
}

export interface MatriculaProps {
    MAT_CODIGO : number,
    ALU_CODIGO? : string,
    TUR_CODIGO? : string,
    MAT_DATA? : string,
    MAT_NUMERO_ALUNO? : string,
}

export interface V_matriculasProps {
    MAT_CODIGO : number,
    ALU_CODIGO? : string,
    TUR_CODIGO? : string,
    MAT_DATA? : string,
    MAT_NUMERO_ALUNO? : string,
    ALU_NOME? : string,
    TUR_DESC? : string,
}

export interface BoletimProps {
    BOL_CODIGO : number,
    MAT_CODIGO? : string,
    BOL_PARECER? : string,
}

export interface V_boletinsProps {
    BOL_CODIGO : number,
    MAT_CODIGO? : string,
    BOL_PARECER? : string,
    TUR_CODIGO? : string,
    TUR_ANO? : string,
    TUR_DESC? : string,
    ALU_NOME? : string,
    DISC_DESC? : string,
    DI_BOL_CODIGO? : string,
    DI_TUR_CODIGO? : string,
    DI_BOL_NOTA1SEMESTRE? : string,
    DI_BOL_NOTA2SEMESTRE? : string,
    DI_BOL_MEDIAANUAL? : string,
    DI_BOL_TOTALFALTAS? : string,
    DI_BOL_RECUPERACAO? : string,
    DI_BOL_MEDIAFINAL? : string,
    DI_BOL_RESULTADO? : string,
}

export interface Disciplinas_boletimProps {
    DI_BOL_CODIGO : number,
    BOL_CODIGO? : string,
    DI_TUR_CODIGO? : string,
    DI_BOL_NOTA1SEMESTRE? : string,
    DI_BOL_NOTA2SEMESTRE? : string,
    DI_BOL_MEDIAANUAL? : string,
    DI_BOL_TOTALFALTAS? : string,
    DI_BOL_RECUPERACAO? : string,
    DI_BOL_MEDIAFINAL? : string,
    DI_BOL_RESULTADO? : string,
}

export interface ProfessorProps {
    PRO_CODIGO : number,
    PRO_NOME? : string,
    CID_CODIGO? : number,
}

export interface V_disciplinas_turmaProps {
    DI_TUR_CODIGO : number,
    DISC_CODIGO? : number,
    DISC_DESC? : string,
    TUR_CODIGO? : number,
    TUR_DESC? : string,
    TUR_ANO? : string,
    SER_CODIGO? : number,
    SER_DESC? : string,
    ESC_CODIGO? : number,
    ESC_NOME? : string,
    PRO_CODIGO? : number,
    PRO_NOME? : string,
}

export interface Dias_letivosProps {
    DIA_CODIGO : number,
    DI_TUR_CODIGO : number,
    DIA_DATA : number,
    DIA_PERIODOS : number,
    DIA_REGISTRODIARIO? : string,
    AUX_DATA?:String,
}
export interface Dias_letivos_presencasProps {
    DIA_CODIGO : number,
    DIAP_CODIGO: number;
    MAT_CODIGO: number;
    DIAP_PRESENCA?: string;
    DIAP_OBSERVACAO?: string;
}
export interface V_dias_letivos_presencasProps {
    DIA_CODIGO : number,
    DIAP_CODIGO: number;
    DIA_DATA?: number;
    MAT_CODIGO: number;
    ALU_NOME?: string;
    DIAP_PRESENCA?: string;
    DIAP_OBSERVACAO?: string;
}

export interface UsuarioProps {
    USU_CODIGO : number,
    USU_NOME? : string,
    USU_LOGIN? : string,
    USU_SENHA? : string,
    USU_LIBERASAUDE? : string,
    USU_LIBERAFROTAS? : string,
    USU_LIBERALICITACAO? : string,
    USU_LIBERAARRECADACAO? : string,
    USU_LIBERAALMOXARIFADO? : string,
    USU_GERAPLANOCUSTOS? : string,
    USU_LIBERACADASTROS? : string,
    USU_LIBERAAGRICULTURA? : string,
    USU_LIBERADOCUMENTOS? : string,
    USU_CADASTRO_PRODUTOS? : string,
    USU_PERFIL? : string,
    USU_PROFESSOR? : string,
}
