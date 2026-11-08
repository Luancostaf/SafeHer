from flask import request, jsonify
from models.plano_seguranca import PlanoSeguranca
from extensions import db

class PlanoSegurancaController:

    @staticmethod
    def buscar(id_usuario):
        try:
            plano = PlanoSeguranca.query.filter_by(id_usuario=id_usuario).first()
            if not plano:
                return jsonify({"encontrado": False}), 200
            return jsonify({"encontrado": True, "plano": plano.to_dict()}), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def salvar():
        data = request.get_json()
        if not data or not data.get('id_usuario') or not data.get('onde_ir'):
            return jsonify({"erro": "Dados incompletos para salvar o plano."}), 400

        try:
            id_usuario = data.get('id_usuario')
            plano = PlanoSeguranca.query.filter_by(id_usuario=id_usuario).first()

            if plano:
                plano.onde_ir = data.get('onde_ir')
                plano.documentos = data.get('documentos', '')
                plano.contatos_emergencia = data.get('contatos_emergencia', '')
            else:
                plano = PlanoSeguranca(
                    id_usuario=id_usuario,
                    onde_ir=data.get('onde_ir'),
                    documentos=data.get('documentos', ''),
                    contatos_emergencia=data.get('contatos_emergencia', '')
                )
                db.session.add(plano)

            db.session.commit()
            return jsonify({"mensagem": "Plano de segurança salvo com sucesso!", "id_plano": plano.id_plano}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"erro": str(e)}), 500