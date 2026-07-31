"""
Solucionador de Rompecabezas de Osamodas
Utiliza el algoritmo Knuth para resolver el código en el menor número de intentos
"""

from itertools import product
from typing import List, Tuple, Set

class OsamodasSolver:
    def __init__(self):
        """Inicializa el solucionador con los 4 elementos elementales"""
        self.elements = ["Aire", "Tierra", "Fuego", "Agua"]
        self.sequence_length = 4
        self.all_combinations = list(product(self.elements, repeat=self.sequence_length))
        self.possible_combinations = self.all_combinations.copy()
        self.attempts = []
        self.feedback_history = []
    
    def calculate_feedback(self, guess: Tuple, secret: Tuple) -> Tuple[int, int]:
        """
        Calcula el feedback para una adivinanza dado el código secreto.
        
        Args:
            guess: Tupla con 4 elementos (la adivinanza)
            secret: Tupla con 4 elementos (el código secreto)
        
        Returns:
            (círculos_blancos, círculos_negros)
        """
        white_circles = 0
        black_circles = 0
        
        # Contar círculos blancos (posiciones correctas)
        secret_remaining = []
        guess_remaining = []
        
        for i in range(len(guess)):
            if guess[i] == secret[i]:
                white_circles += 1
            else:
                secret_remaining.append(secret[i])
                guess_remaining.append(guess[i])
        
        # Contar círculos negros (elementos correctos, posición incorrecta)
        for element in guess_remaining:
            if element in secret_remaining:
                black_circles += 1
                secret_remaining.remove(element)
        
        return (white_circles, black_circles)
    
    def filter_combinations(self, guess: Tuple, feedback: Tuple[int, int]):
        """
        Filtra las combinaciones posibles basadas en el feedback recibido.
        
        Args:
            guess: La adivinanza realizada
            feedback: (círculos_blancos, círculos_negros)
        """
        self.attempts.append(guess)
        self.feedback_history.append(feedback)
        
        # Mantener solo las combinaciones que darían el mismo feedback
        new_possible = []
        for combo in self.possible_combinations:
            if self.calculate_feedback(guess, combo) == feedback:
                new_possible.append(combo)
        
        self.possible_combinations = new_possible
    
    def get_next_guess(self) -> Tuple:
        """
        Selecciona el siguiente intento usando el algoritmo Knuth.
        Elige la combinación que minimiza el número máximo de posibilidades restantes.
        
        Returns:
            Tupla con el siguiente intento
        """
        if not self.possible_combinations:
            return None
        
        if len(self.possible_combinations) == 1:
            return self.possible_combinations[0]
        
        # Para la primera adivinanza, usar una estrategia simple
        if not self.attempts:
            return ("Aire", "Aire", "Tierra", "Tierra")
        
        best_guess = None
        best_score = float('inf')
        
        # Probar todas las combinaciones posibles
        for guess in self.possible_combinations[:100]:  # Limitar para eficiencia
            scores = {}
            
            # Calcular el feedback para cada combinación posible
            for combo in self.possible_combinations:
                feedback = self.calculate_feedback(guess, combo)
                if feedback not in scores:
                    scores[feedback] = 0
                scores[feedback] += 1
            
            # El score es el máximo de elementos en cualquier grupo de feedback
            max_score = max(scores.values())
            
            if max_score < best_score:
                best_score = max_score
                best_guess = guess
        
        return best_guess
    
    def solve_interactive(self):
        """
        Modo interactivo: guía al usuario a través del proceso de resolución.
        """
        print("=" * 60)
        print("SOLUCIONADOR DE ROMPECABEZAS DE OSAMODAS")
        print("=" * 60)
        print("\nElementos disponibles: Aire, Tierra, Fuego, Agua")
        print("\nInstrucciones:")
        print("1. Se te sugerirá una combinación")
        print("2. Intenta esa combinación en el juego")
        print("3. Ingresa el feedback (círculos blancos y negros)")
        print("4. Repite hasta resolver el código\n")
        
        while len(self.possible_combinations) > 1:
            guess = self.get_next_guess()
            
            if guess is None:
                print("❌ No hay más combinaciones posibles. Verifica el feedback.")
                break
            
            attempt_num = len(self.attempts) + 1
            print(f"\n--- INTENTO {attempt_num} ---")
            print(f"Intenta esta combinación:")
            print(f"  1. {guess[0]}")
            print(f"  2. {guess[1]}")
            print(f"  3. {guess[2]}")
            print(f"  4. {guess[3]}")
            
            # Solicitar feedback del usuario
            try:
                white = int(input("\n¿Cuántos círculos BLANCOS obtuviste? "))
                black = int(input("¿Cuántos círculos NEGROS obtuviste? "))
                
                if white == 4:
                    print("\n" + "=" * 60)
                    print("🎉 ¡FELICIDADES! ¡CÓDIGO ENCONTRADO!")
                    print(f"El código secreto es: {' -> '.join(guess)}")
                    print("=" * 60)
                    return guess
                
                self.filter_combinations(guess, (white, black))
                print(f"\nCombinaciones posibles restantes: {len(self.possible_combinations)}")
                
            except ValueError:
                print("❌ Entrada inválida. Ingresa números enteros.")
                continue
        
        if self.possible_combinations:
            final_answer = self.possible_combinations[0]
            print("\n" + "=" * 60)
            print("🎉 ¡CÓDIGO ENCONTRADO!")
            print(f"El código secreto es: {' -> '.join(final_answer)}")
            print("=" * 60)
            return final_answer
    
    def solve_automatic(self, secret: Tuple) -> Tuple[Tuple, List]:
        """
        Modo automático: resuelve automáticamente un código secreto conocido.
        
        Args:
            secret: Tupla con el código secreto a resolver
        
        Returns:
            (código_encontrado, lista_de_intentos)
        """
        print("=" * 60)
        print("MODO AUTOMÁTICO - RESOLVIENDO CÓDIGO SECRETO")
        print(f"Código: {secret}")
        print("=" * 60)
        
        while len(self.possible_combinations) > 0:
            guess = self.get_next_guess()
            
            if guess is None:
                break
            
            feedback = self.calculate_feedback(guess, secret)
            attempt_num = len(self.attempts) + 1
            
            print(f"\nIntento {attempt_num}: {guess}")
            print(f"Feedback: {feedback[0]} blancos, {feedback[1]} negros")
            
            self.attempts.append(guess)
            self.feedback_history.append(feedback)
            
            if feedback == (4, 0):
                print(f"\n✅ ¡Código encontrado en {attempt_num} intentos!")
                return (guess, self.attempts)
            
            # Filtrar combinaciones
            new_possible = []
            for combo in self.possible_combinations:
                if self.calculate_feedback(guess, combo) == feedback:
                    new_possible.append(combo)
            
            self.possible_combinations = new_possible
            print(f"Combinaciones restantes: {len(self.possible_combinations)}")
        
        return (None, self.attempts)


def main():
    import sys
    
    solver = OsamodasSolver()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--auto":
        # Modo automático con un código secreto
        if len(sys.argv) == 6:
            secret = tuple(sys.argv[2:6])
            solver.solve_automatic(secret)
        else:
            print("Uso: python solver.py --auto Aire Tierra Fuego Agua")
    else:
        # Modo interactivo
        solver.solve_interactive()


if __name__ == "__main__":
    main()
