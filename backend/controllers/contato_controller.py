from flask import request, jsonify
from models.contato import Contato
from extensions import db

class ContatoController:
    
    @staticmethod
    def listar(id_usuario):
        try:
            contatos = Contato.query.filter_by(id_usuario=id_usuario).all()
            return jsonify([c.to_dict() for c in contatos]), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def cadastrar():
        data = request.get_json()
        
        if not data or not data.get('id_usuario') or not data.get('nome') or not data.get('telefone'):
            return jsonify({"erro": "Preencha todos os campos obrigatórios."}), 400

        try:
            novo_contato = Contato(
                id_usuario=data.get('id_usuario'),
                nome=data.get('nome').strip(),
                telefone=data.get('telefone').strip(),
                email=data.get('email').strip() if data.get('email') else None
            )
            
            db.session.add(novo_contato)
            db.session.commit()
            
            return jsonify({
                "mensagem": "Contato cadastrado com sucesso!",
                "id_contato": novo_contato.id_contato
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({"erro": str(e)}), 500

    @staticmethod
    def deletar(id_contato):
        try:
            contato = Contato.query.get(id_contato)
            if not contato:
                return jsonify({"erro": "Contato não encontrado."}), 404
            
            db.session.delete(contato)
            db.session.commit()
            
            return jsonify({"mensagem": "Contato removido com sucesso!"}), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({"erro": str(e)}), 500