from flask import request, jsonify
from models.tarefa import Tarefa
from extensions import db

class TarefaController:

    @staticmethod
    def listar(id_usuario):
        try:
            tarefas = Tarefa.query.filter_by(id_usuario=id_usuario).order_by(Tarefa.id_tarefa.desc()).all()
            return jsonify([t.to_dict() for t in tarefas]), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def criar():
        data = request.get_json()
        if not data or not data.get('id_usuario') or not data.get('titulo'):
            return jsonify({"erro": "Dados incompletos."}), 400

        try:
            nova_tarefa = Tarefa(
                id_usuario=data.get('id_usuario'),
                titulo=data.get('titulo'),
                detalhe=data.get('detalhe', ''),
                concluida=False
            )
            db.session.add(nova_tarefa)
            db.session.commit()
            return jsonify({"mensagem": "Tarefa criada com sucesso!", "tarefa": nova_tarefa.to_dict()}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def atualizar(id_tarefa):
        data = request.get_json()
        try:
            tarefa = Tarefa.query.get(id_tarefa)
            if not tarefa:
                return jsonify({"erro": "Tarefa não encontrada."}), 404
            
            if 'concluida' in data:
                tarefa.concluida = data['concluida']
            if 'titulo' in data:
                tarefa.titulo = data['titulo']
            if 'detalhe' in data:
                tarefa.detalhe = data['detalhe']

            db.session.commit()
            return jsonify({"mensagem": "Tarefa atualizada com sucesso!", "tarefa": tarefa.to_dict()}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def deletar(id_tarefa):
        try:
            tarefa = Tarefa.query.get(id_tarefa)
            if not tarefa:
                return jsonify({"erro": "Tarefa não encontrada."}), 404
            db.session.delete(tarefa)
            db.session.commit()
            return jsonify({"mensagem": "Tarefa removida com sucesso!"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"erro": str(e)}), 500