import Dashboard from "views/Dashboard.js";
import LockScreen from "views/pages/LockScreen.js";
import Login from "views/pages/Login.js";
import Register from "views/pages/Register.js";



import CidadeList from 'components/cidade/list';
import CidadeForm from 'components/cidade/form';

import AlunoList from 'components/aluno/list';
import AlunoForm from 'components/aluno/form';

import ProfessorList from 'components/professor/list';
import ProfessorForm from 'components/professor/form';

import EscolaList from 'components/escola/list';
import EscolaForm from 'components/escola/form';

import Nivel_de_ensinoList from 'components/nivel_de_ensino/list';
import Nivel_de_ensinoForm from 'components/nivel_de_ensino/form';

import SerieList from 'components/serie/list';
import SerieForm from 'components/serie/form';

import TurmaList from 'components/turma/list';
import TurmaForm from 'components/turma/form';

import DisciplinaList from 'components/disciplina/list';
import DisciplinaForm from 'components/disciplina/form';

import Disciplinas_da_turmaList from 'components/disciplinas_da_turma/list';
import Disciplinas_da_turmaForm from 'components/disciplinas_da_turma/form';

import MatriculaList from 'components/matricula/list';
import MatriculaForm from 'components/matricula/form';



import BoletimList from 'components/boletim/list';
import BoletimForm from 'components/boletim/form';

import DisciplinaProfessorList from 'components/v_disciplinas_professor/list';
import DisciplinaProfessorForm from 'components/v_disciplinas_professor/form';
import MenuDisciplina from 'components/v_disciplinas_professor/menuDisciplina';
import MenuChamada from 'components/chamada/menuChamada';

import Dias_letivosList from 'components/dias_letivos/list';
import Dias_letivosForm from 'components/dias_letivos/form';
import Dias_letivos_presencasForm from 'components/dias_letivos_presencas/form';

import UsuarioList from 'components/usuario/list';
import UsuarioForm from 'components/usuario/form';
import UsuarioPerfil from 'components/usuario/perfil';

export const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin",
  },

  {
    collapse: true,
    name: "Cadastros Gerais",
    icon: "nc-icon nc-ruler-pencil",
    state: "formsCollapse",
    views: [
      {
        path: "/cidade",
        name: "Cidade",
        mini: "Cid",
        component: CidadeList,
        layout: "/admin",
      },
    ]
  },

  {
    collapse: true,
    name: "Escolas",
    icon: "nc-icon nc-paper",
    state: "formsCollapse",
    views: [
      {
        path: "/escola",
        name: "Escola",
        mini: "Esc",
        component: EscolaList,
        layout: "/admin",
      },
      {
        path: "/nivel_de_ensino",
        name: "Nivel de ensino",
        mini: 'N.E.',
        component: Nivel_de_ensinoList,
        layout: "/admin",
      },
      {
        path: "/disciplina",
        name: "Disciplina",
        mini: 'Disc',
        component: DisciplinaList,
        layout: "/admin",
      },
      {
        path: "/serie",
        name: "Serie",
        mini: 'Ser',
        component: SerieList,
        layout: "/admin",
      },
      {
        path: "/turma",
        name: "Turma",
        mini: 'Tur',
        component: TurmaList,
        layout: "/admin",
      },
      {
        path: "/boletim",
        name: "Boletim",
        mini: 'Bol',
        component: BoletimList,
        layout: "/admin",
      },
              
      
      
      {
        path: "/aluno",
        name: "Aluno",
        mini: "Alu",
        component: AlunoList,
        layout: "/admin",
      },
      {
        path: "/professor",
        name: "Professor",
        mini: "Prof",
        component: ProfessorList,
        layout: "/admin",
      },


    ],
  },




];

export const routes2 = [
  {
    path: "/escola_new",
    name: "Escola",
    mini: 'esco',
    component: EscolaForm,
    layout: "/admin",
  },
  {
    path: "/escola_edit/:ESC_CODIGO",
    name: "Escola",
    mini: 'esco',
    component: EscolaForm,
    layout: "/admin",
  },
  {
    path: "/nivel_de_ensino_new",
    name: "Nivel_de_ensino",
    mini: 'nive',
    mini: 'N.e.',
    layout: "/admin",
  },
  {
    path: "/nivel_de_ensino_edit/:NIV_CODIGO",
    name: "Nivel_de_ensino",
    mini: 'nive',
    component: Nivel_de_ensinoForm,
    layout: "/admin",
  },
  {
    path: "/turma_new",
    name: "Turma",
    mini: 'turm',
    component: TurmaForm,
    layout: "/admin",
  },
  {
    path: "/turma_edit/:TUR_CODIGO",
    name: "Turma",
    mini: 'turm',
    component: TurmaForm,
    layout: "/admin",
  },
  
  {
    path: "/cidade_new",
    name: "Cidade",
    mini: 'Cid',
    component: CidadeForm,
    layout: "/admin",
  },
  {
    path: "/cidade_edit/:CID_CODIGO",
    name: "Cidade",
    mini: 'Cid',
    component: CidadeForm,
    layout: "/admin",
  },
  {
    path: "/aluno_new",
    name: "Aluno",
    mini: 'Alu',
    component: AlunoForm,
    layout: "/admin",
  },
  {
    path: "/aluno_edit/:ALU_CODIGO",
    name: "Aluno",
    mini: 'Alu',
    component: AlunoForm,
    layout: "/admin",
  },
  {
    path: "/professor_new",
    name: "Professor",
    mini: 'Prof',
    component: ProfessorForm,
    layout: "/admin",
  },
  {
    path: "/professor_edit/:PRO_CODIGO",
    name: "Professor",
    mini: 'Prof',
    component: ProfessorForm,
    layout: "/admin",
  },
  {
    path: "/serie_new",
    name: "Serie",
    mini: 'seri',
    component: SerieForm,
    layout: "/admin",
  },
  {
    path: "/serie_edit/:SER_CODIGO",
    name: "Serie",
    mini: 'seri',
    component: SerieForm,
    layout: "/admin",
  },
  {
    path: "/disciplina_new",
    name: "Disciplina",
    mini: 'disc',
    component: DisciplinaForm,
    layout: "/admin",
  },
  {
    path: "/disciplina_edit/:DISC_CODIGO",
    name: "Disciplina",
    mini: 'disc',
    component: DisciplinaForm,
    layout: "/admin",
  },
  // {
  //   path: "/disciplinas_da_turma",
  //   name: "Disciplinas_da_turma",
  //   mini: 'D.T.',
  //   component: Disciplinas_da_turmaList,
  //   layout: "/admin",
  // },
  // {
  //   path: "/disciplinas_da_turma_new",
  //   name: "Disciplinas_da_turma",
  //   mini: 'D.T.',
  //   component: Disciplinas_da_turmaForm,
  //   layout: "/admin",
  // },
  {
    path: "/disciplinas_da_turma/:TUR_CODIGO",
    name: "Disciplinas_da_turma",
    mini: 'D.T.',
    component: Disciplinas_da_turmaForm,
    layout: "/admin",
  },
  {
    path: "/matricula/:TUR_CODIGO",
    name: "Matricula",
    mini: 'MAT',
    component: MatriculaForm,
    layout: "/admin",
  },
  // {
  //   path: "/matricula_new",
  //   name: "Matricula",
  //   mini: 'matr',
  //   component: MatriculaForm,
  //   layout: "/admin",
  // },
  // {
  //   path: "/matricula_edit/:MAT_CODIGO",
  //   name: "Matricula",
  //   mini: 'matr',
  //   component: MatriculaForm,
  //   layout: "/admin",
  // },
  
{
  path: "/boletim_new",
  name: "Boletim",
  mini: 'BOL',
  component: BoletimForm,
  layout: "/admin",
},
{
  path: "/boletim_edit/:BOL_CODIGO",
  name: "Boletim",
  mini: 'BOL',
  component: BoletimForm,
  layout: "/admin",
},
{
  path: "/v_disciplinas_turma_edit/:DI_TUR_CODIGO",
  name: "Disciplina da Turma",
  mini: 'Di_T',
  component: DisciplinaProfessorForm,
  layout: "/admin",
},

{
  path: "/menudisciplina",
  name: "Menu Disciplina",
  mini: 'Di_T',
  component: MenuDisciplina,
  layout: "/admin",
},
{
  path: "/menuchamada",
  name: "Menu Chamada",
  mini: 'Di_T',
  component: MenuChamada,
  layout: "/admin",
},
{
  path: "/dias_letivos",
  name: "Dias_letivos",
  icon: "nc-icon nc-single-copy-04",
  component: Dias_letivosList,
  layout: "/admin",
},
{
  path: "/dias_letivos_new",
  name: "Dias_letivos",
  mini: 'dias',
  component: Dias_letivosForm,
  layout: "/admin",
},
{
  path: "/dias_letivos_edit/:DIA_CODIGO",
  name: "Dias_letivos",
  mini: 'dias',
  component: Dias_letivosForm,
  layout: "/admin",
},
{
  path: "/dias_letivos_presencas_edit/:DIA_CODIGO",
  name: "Dias_letivos_presencas",
  mini: 'dias',
  component: Dias_letivos_presencasForm,
  layout: "/admin",
},
{
  path: "/usuario_new",
  name: "Usuario",
  mini: 'usua',
  component: UsuarioForm,
  layout: "/admin",
},
{
  path: "/usuario_edit/:USU_CODIGO",
  name: "Usuario",
  mini: 'usua',
  component: UsuarioForm,
  layout: "/admin",
},

];


export const routesProfessor = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-bank",
    component: Dashboard,
    layout: "/admin",
  },

  {
    collapse: true,
    name: "Professor",
    icon: "nc-icon nc-paper",
    state: "formsCollapse",
    views: [
  {
    path: "/disciplinas_professor",
    name: "Disciplinas do Professor",
    mini: "Di_P",
    component: DisciplinaProfessorList,
    layout: "/admin",
  },
  
  {
    path: "/perfil/",
    name: "Perfil",
    mini: 'Perf',
    component: UsuarioPerfil,
    layout: "/admin",
  },
  

  ]}
];