from flask import request, jsonify
from models.relatorio import Relatorio
from models.diario import Diario
from models.registro import Registro
from extensions import db
from datetime import datetime

class RelatorioController:

    @staticmethod
    def listar(id_usuario):
        try:
            relatorios = Relatorio.query.filter_by(id_usuario=id_usuario).order_by(Relatorio.data_geracao.desc()).all()
            return jsonify([r.to_dict() for r in relatorios]), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def gerar():
        data = request.get_json()
        if not data or not data.get('id_usuario'):
            return jsonify({"erro": "Usuário não identificado."}), 400

        try:
            id_usuario = data.get('id_usuario')
            senha = data.get('senha', '')

            total_diarios = Diario.query.filter_by(id_usuario=id_usuario).count()
            total_avaliacoes = Registro.query.filter_by(id_usuario=id_usuario).count()

            mes_ano = datetime.now().strftime('%B/%Y')
            titulo_relatorio = f"Relatório - {mes_ano} ({total_avaliacoes} avaliações, {total_diarios} relatos)"

            novo_relatorio = Relatorio(
                id_usuario=id_usuario,
                titulo=titulo_relatorio,
                senha_hash=senha if senha else None
            )

            db.session.add(novo_relatorio)
            db.session.commit()

            return jsonify({
                "mensagem": "Relatório gerado com sucesso!",
                "relatorio": novo_relatorio.to_dict()
            }), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"erro": str(e)}), 500