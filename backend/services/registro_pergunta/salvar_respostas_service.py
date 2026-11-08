from models.registro_pergunta import RegistroPergunta

MAPA_RESPOSTAS = {
    0: 'NUNCA',
    1: 'RARAMENTE',
    2: 'AS_VEZES',
    3: 'FREQUENTEMENTE',
    4: 'SEMPRE'
}

class SalvarRespostasService:
    @staticmethod
    def executar(dados):
        # Permite receber um único dicionário ou uma lista de dicionários
        itens = [dados] if isinstance(dados, dict) else dados
        respostas_salvas = []

        for item in itens:
            val_resposta = item.get('resposta')
            if val_resposta is None:
                val_resposta = item.get('valor_resposta', 0)

            if isinstance(val_resposta, int) or (isinstance(val_resposta, str) and val_resposta.isdigit()):
                val_enum = MAPA_RESPOSTAS.get(int(val_resposta), 'NUNCA')
            else:
                val_enum = val_resposta

            rp = RegistroPergunta(
                id_registro=item['id_registro'],
                id_pergunta=item['id_pergunta'],
                resposta=val_enum
            )
            rp.salvar()
            respostas_salvas.append(rp)

        return respostas_salvas