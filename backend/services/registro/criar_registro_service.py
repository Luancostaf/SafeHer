from models.registro import Registro

class CriarRegistroService:
    @staticmethod
    def executar(dados):
        if not dados.get('id_usuario') or dados.get('indice_comportamental') is None:
            raise ValueError("Dados insuficientes para criar o registro.")

        # Tratamento do ENUM de classificacao
        classificacao_raw = str(dados.get('classificacao', '')).upper()
        
        if 'ALTO' in classificacao_raw or 'ALTA' in classificacao_raw:
            classificacao_enum = 'ALTO'
        elif 'MODERAD' in classificacao_raw or 'MEDIO' in classificacao_raw or 'MÉDIO' in classificacao_raw:
            classificacao_enum = 'MODERADO'
        else:
            classificacao_enum = 'BAIXO'

        novo_registro = Registro(
            id_usuario=dados['id_usuario'],
            id_recomendacao=dados.get('id_recomendacao'),
            indice_comportamental=dados['indice_comportamental'],
            classificacao=classificacao_enum,
            observacao=dados.get('observacao', 'Avaliação realizada pelo aplicativo')
        )
        novo_registro.salvar()
        return novo_registro