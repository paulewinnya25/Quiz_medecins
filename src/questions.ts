import { Question } from './types';

export const questions: Question[] = [
  // Bloc 1 – L'écoute, la communication et la confiance
  {
    id: 1,
    question: "Combien de patients se sentent pleinement écoutés par leur médecin ?",
    answers: ["80 %", "36 %", "60 %"],
    correctAnswer: 1,
    explanation: "Moins de 4 patients sur 10 se sentent réellement écoutés : c'est le premier marqueur de qualité humaine."
  },
  {
    id: 2,
    question: "Combien comprennent clairement leur plan de traitement après la consultation ?",
    answers: ["45 %", "75 %", "30 %"],
    correctAnswer: 0,
    explanation: "Près d'un patient sur deux repart confus sur le \"quoi faire ensuite\"."
  },
  {
    id: 3,
    question: "Combien osent dire quand ils ne comprennent pas une explication médicale ?",
    answers: ["75 %", "40 %", "10 %"],
    correctAnswer: 1,
    explanation: "Le patient n'ose pas interrompre le médecin, par peur ou par respect."
  },
  {
    id: 4,
    question: "Combien estiment que les décisions sont guidées plus par le système que par leur intérêt personnel ?",
    answers: ["20 %", "35 %", "50 %"],
    correctAnswer: 2,
    explanation: "La confiance perçue dans l'intention médicale est un pilier de la relation."
  },
  {
    id: 5,
    question: "Combien pensent que leur médecin est stressé ou pressé pendant la consultation ?",
    answers: ["25 %", "65 %", "10 %"],
    correctAnswer: 1,
    explanation: "Le stress du soignant se perçoit et influence directement la qualité du lien."
  },
  
  // Bloc 2 – Le parcours et la coordination des soins
  {
    id: 6,
    question: "Combien jugent leur parcours de soins \"trop fragmenté\" ?",
    answers: ["20 %", "60 %", "80 %"],
    correctAnswer: 1,
    explanation: "La coordination inter-services est l'un des points faibles universels du système de santé."
  },
  {
    id: 7,
    question: "Combien ont dû répéter les mêmes informations à plusieurs interlocuteurs ?",
    answers: ["20 %", "70 %", "40 %"],
    correctAnswer: 1,
    explanation: "Les doublons administratifs augmentent la lassitude et les erreurs."
  },
  {
    id: 8,
    question: "Combien savent qui est leur médecin référent pendant leur hospitalisation ?",
    answers: ["70 %", "50 %", "30 %"],
    correctAnswer: 2,
    explanation: "Un patient sur trois seulement sait à qui s'adresser en cas de doute."
  },
  {
    id: 9,
    question: "Combien n'ont reçu aucun contact après leur sortie d'hôpital ?",
    answers: ["70 %", "25 %", "10 %"],
    correctAnswer: 0,
    explanation: "Le suivi post-soin est souvent inexistant, alors qu'il conditionne la récupération."
  },
  {
    id: 10,
    question: "Combien trouvent les coûts ou factures peu clairs ?",
    answers: ["50 %", "80 %", "25 %"],
    correctAnswer: 1,
    explanation: "L'opacité financière crée de la méfiance, même quand la qualité médicale est bonne."
  },
  
  // Bloc 3 – La pratique médicale et la valeur clinique
  {
    id: 11,
    question: "Quelle part des actes médicaux serait non nécessaire selon les études ?",
    answers: ["10 %", "20 à 30 %", "50 %"],
    correctAnswer: 1,
    explanation: "Une part significative des actes n'apporte pas de bénéfice clinique tangible."
  },
  {
    id: 12,
    question: "Combien de patients arrêtent ou ne prennent pas leur traitement dans le mois ?",
    answers: ["20 %", "35 %", "50 %"],
    correctAnswer: 2,
    explanation: "L'observance est la principale faille invisible du parcours patient."
  },
  {
    id: 13,
    question: "Quelle part des complications hospitalières est évitable ?",
    answers: ["15 %", "40 %", "60 %"],
    correctAnswer: 1,
    explanation: "Près d'une complication sur deux pourrait être évitée par des pratiques simples."
  },
  {
    id: 14,
    question: "Combien de patients n'ont pas été consultés avant une décision médicale majeure ?",
    answers: ["20 %", "60 %", "80 %"],
    correctAnswer: 1,
    explanation: "La participation du patient reste une dimension à renforcer partout."
  },
  {
    id: 15,
    question: "Combien d'erreurs médicales sont liées à des défauts de communication entre soignants ?",
    answers: ["70 %", "30 %", "10 %"],
    correctAnswer: 0,
    explanation: "Le partage d'information sauve plus de vies que la technologie."
  },
  
  // Bloc 4 – Efficience, économie et éthique
  {
    id: 16,
    question: "Quelle part des dépenses mondiales de santé n'apporte pas de bénéfice clinique réel ?",
    answers: ["10 %", "20 à 25 %", "40 %"],
    correctAnswer: 1,
    explanation: "Un quart des dépenses mondiales pourrait être réinvesti dans la valeur réelle."
  },
  {
    id: 17,
    question: "Combien de patients renoncent à des soins pour raisons financières ?",
    answers: ["20 %", "50 %", "70 %"],
    correctAnswer: 1,
    explanation: "Même dans les systèmes couverts, les coûts cachés découragent l'accès aux soins."
  },
  {
    id: 18,
    question: "Combien de médecins pensent pouvoir réduire 10 à 20 % de leurs actes s'ils avaient une meilleure coordination ?",
    answers: ["30 %", "70 %", "90 %"],
    correctAnswer: 1,
    explanation: "Les professionnels reconnaissent eux-mêmes le potentiel d'efficacité du travail d'équipe."
  },
  {
    id: 19,
    question: "Combien de décès évitables par an sont liés à des erreurs de communication ?",
    answers: ["50 000", "120 000", "250 000"],
    correctAnswer: 2,
    explanation: "La \"non-communication\" est une cause de mortalité plus importante que beaucoup de pathologies."
  },
  {
    id: 20,
    question: "Dans votre pratique, quelle part de votre temps crée réellement de la valeur pour le patient ?",
    answers: ["Plus de 80 %", "Environ 50 %", "Moins de 20 %"],
    correctAnswer: 1,
    explanation: "La VBHC invite à recentrer l'effort collectif sur les activités qui comptent vraiment."
  }
];
