// Perguntas do questionário (escala: 0 Nunca ... 4 Sempre)
const QUESTIONS = [
    "Seu parceiro costuma controlar com quem você conversa?",
    "Ele verifica seu celular, redes sociais ou mensagens sem sua permissão?",
    "Ele demonstra ciúmes excessivo mesmo em situações comuns?",
    "Ele te impede ou dificulta o contato com amigos e familiares?",
    "Ele critica ou humilha você na frente de outras pessoas?",
    "Ele controla como você deve se vestir ou se comportar?",
    "Ele controla o seu dinheiro ou limita seu acesso a recursos financeiros?",
    "Ele ameaça terminar o relacionamento ou machucar você quando vocês discordam?",
    "Ele muda de humor repentinamente, alternando entre carinho e agressividade?",
    "Ele faz você se sentir culpada por coisas que não são sua responsabilidade?",
    "Ele desvaloriza suas opiniões, sonhos ou conquistas?",
    "Ele monitora sua localização ou exige satisfações sobre onde você está?",
    "Ele levanta a voz, grita ou usa palavras ofensivas durante discussões?",
    "Ele pressiona você a fazer coisas com as quais não se sente confortável?",
    "Você sente medo da reação dele ao discordar ou dizer não?"
];

const ANSWER_OPTIONS = [
    { label: "Nunca", value: 0 },
    { label: "Raramente", value: 1 },
    { label: "ÀS vezes", value: 2 },
    { label: "Frequentemente", value: 3 },
    { label: "Sempre", value: 4 }
];

const RECOMMENDATIONS = [
    "Observe se esses comportamentos continuam ocorrendo ao longo do tempo.",
    "Converse com pessoas de confiança sobre o que você tem sentido.",
    "Procure informações confiáveis sobre relacionamentos saudáveis.",
    "Registre em um diário situações que te causem desconforto.",
    "Caso sinta necessidade, busque apoio especializado — psicológico, jurídico ou emergencial (Ligue 180)."
]

const TIP_OF_DAY = "Reconhecerpadrões é o primeiro passo. Escute sua intuição — ela costuma perceber antes da razão.";

function getResultTier(percent) {
    if (percent <= 25) {
        return {
            label: "Baixo indício de  alerta",
            message: "Poucos comportamentos preocupantes foram identificados nas suas respostas. Continue atenta e cuidando de si."
        };
    } else if (percent <= 55) {
        return {
            label: "Atenção moderada",
            message: "Alguns comportamentos observados merecem atenção e reflexão"
        };
    } else {
        return {
            label: "Atenção alta",
            message: "Vários comportamentos identificados sugerem atenção redobrada. Considere buscar apoio especializado."
        };
    }
}