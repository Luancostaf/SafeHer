from flask import request, jsonify
from models.diario import Diario
from extensions import db
from datetime import datetime

class DiarioController:

    @staticmethod
    def listar(id_usuario):
        try:
            registros = Diario.query.filter_by(id_usuario=id_usuario).order_by(Diario.data_ocorrido.desc()).all()
            return jsonify([r.to_dict() for r in registros]), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def salvar():
        data = request.get_json()

        if not data or not data.get('id_usuario') or not data.get('titulo') or not data.get('descricao') or not data.get('data_ocorrido'):
            return jsonify({"erro": "Preencha todos os campos obrigatórios."}), 400

        try:
            data_ocorrido_obj = datetime.strptime(data.get('data_ocorrido'), '%Y-%m-%d').date()

            novo_registro = Diario(
                id_usuario=data.get('id_usuario'),
                titulo=data.get('titulo').strip(),
                descricao=data.get('descricao').strip(),
                data_ocorrido=data_ocorrido_obj
            )

            db.session.add(novo_registro)
            db.session.commit()

            return jsonify({
                "mensagem": "Registro do diário salvo com sucesso!",
                "id_diario": novo_registro.id_diario
            }), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def deletar(id_diario):
        try:
            registro = Diario.query.get(id_diario)
            if not registro:
                return jsonify({"erro": "Registro não encontrado."}), 404

            db.session.delete(registro)
            db.session.commit()

            return jsonify({"mensagem": "Registro do diário excluído com sucesso!"}), 200

        except Exception as e:
            db.session.rollback()
            return jsonify({"erro": str(e)}), 500