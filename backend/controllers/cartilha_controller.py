from flask import jsonify, request
from models.cartilha import Cartilha

class CartilhaController:

    @staticmethod
    def listar():
        try:
            categoria = request.args.get('categoria')
            if categoria and categoria != 'Todos':
                artigos = Cartilha.query.filter_by(categoria=categoria).all()
            else:
                artigos = Cartilha.query.all()

            return jsonify([a.to_dict() for a in artigos]), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500