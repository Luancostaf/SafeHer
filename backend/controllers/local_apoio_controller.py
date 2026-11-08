from flask import jsonify, request
from models.local_apoio import LocalApoio

class LocalApoioController:

    @staticmethod
    def listar():
        try:
            categoria_filtro = request.args.get('categoria')
            
            if categoria_filtro and categoria_filtro != 'Todos':
                locais = LocalApoio.query.filter_by(categoria=categoria_filtro).all()
            else:
                locais = LocalApoio.query.all()

            return jsonify([l.to_dict() for l in locais]), 200
        except Exception as e:
            return jsonify({"erro": str(e)}), 500