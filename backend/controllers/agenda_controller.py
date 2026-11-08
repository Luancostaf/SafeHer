from flask import request, jsonify
from models.agenda import Agenda
from extensions import db

class AgendaController:

    @staticmethod
    def listar(id_usuario):
        try:
            eventos = Agenda.query.filter_by(id_usuario=id_usuario).order_by(Agenda.id_evento.desc()).all()
            return jsonify([e.to_dict() for e in eventos]), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def criar():
        data = request.get_json()
        if not data or not data.get('id_usuario') or not data.get('titulo'):
            return jsonify({"erro": "Dados incompletos."}), 400

        try:
            novo_evento = Agenda(
                id_usuario=data.get('id_usuario'),
                titulo=data.get('titulo'),
                detalhe=data.get('detalhe', ''),
                dia=data.get('dia', '10'),
                mes=data.get('mes', 'Mai')
            )
            db.session.add(novo_evento)
            db.session.commit()
            return jsonify({"mensagem": "Evento criado com sucesso!", "evento": novo_evento.to_dict()}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def deletar(id_evento):
        try:
            evento = Agenda.query.get(id_evento)
            if not evento:
                return jsonify({"erro": "Evento não encontrado."}), 404
            db.session.delete(evento)
            db.session.commit()
            return jsonify({"mensagem": "Evento removido com sucesso!"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"erro": str(e)}), 500