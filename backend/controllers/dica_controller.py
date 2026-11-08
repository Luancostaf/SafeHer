from flask import jsonify
from services.dica.buscar_dica_dia_service import BuscarDicaDiaService

class DicaController:
    @staticmethod
    def buscar_dica_dia():
        dica = BuscarDicaDiaService.executar()
        if not dica:
            return jsonify({'erro': 'Nenhuma dica encontrada.'}), 404
        return jsonify(dica.to_dict()), 200