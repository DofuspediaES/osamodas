# 🧩 Solucionador de Osamodas

Un solucionador inteligente para el rompecabezas de Mastermind de la invocación de Osamodas en Dofus.

## 📋 Descripción

Este script resuelve el código secreto de 4 elementos elementales utilizando el **algoritmo de Knuth**, que minimiza el número de intentos necesarios para encontrar la combinación correcta.

**Elementos disponibles:**
- Aire 🌪️
- Tierra 🌍
- Fuego 🔥
- Agua 💧

## 🎮 Modos de Uso

### Modo Interactivo

Ejecuta el script y sigue las instrucciones:

```bash
python solver.py
```

**Pasos:**
1. El programa te sugerirá una combinación
2. Ingresa esa combinación en el juego de Osamodas
3. Observa los círculos (blancos y negros) que aparecen
4. Ingresa el feedback en el programa
5. Repite hasta encontrar el código

**Ejemplo de sesión:**

```
--- INTENTO 1 ---
Intenta esta combinación:
  1. Aire
  2. Aire
  3. Tierra
  4. Tierra

¿Cuántos círculos BLANCOS obtuviste? 1
¿Cuántos círculos NEGROS obtuviste? 2

Combinaciones posibles restantes: 45
```

### Modo Automático

Para probar con un código conocido:

```bash
python solver.py --auto Aire Tierra Fuego Agua
```

Resuelve automáticamente y muestra todos los intentos.

## 📊 Feedback del Juego

- **Círculo Blanco** ⚪ = Elemento correcto en la posición correcta
- **Círculo Negro** ⚫ = Elemento correcto pero en posición incorrecta
- **Nada** = Elemento que no existe en el código

## 🔍 Ejemplo de Resolución

Si lanzas: **Telúrico → Acuático → Aéreo → Telúrico**

Y obtienes: **2 blancos, 1 negro**

Significa:
- 2 elementos están en la posición correcta
- 1 elemento está en el código pero en posición incorrecta
- 1 elemento no existe en el código

## ⚙️ Algoritmo

Utiliza el **Algoritmo de Knuth para Mastermind:**

1. **Generación**: Crea todas las 256 combinaciones posibles (4^4)
2. **Predicción**: Sugiere el intento que mejor divide el espacio de búsqueda
3. **Filtración**: Elimina combinaciones imposibles según el feedback
4. **Convergencia**: Repite hasta encontrar el código (máximo 5 intentos)

## 📈 Eficiencia

- **Promedio de intentos**: 4-5
- **Máximo de intentos**: 5
- **Precisión**: 100%

## 📝 Requisitos

- Python 3.6+
- Sin dependencias externas

## 🚀 Ejecución Rápida

```bash
# Interactivo
python solver.py

# Automático (ejemplo)
python solver.py --auto Agua Fuego Agua Tierra
```

## 🎯 Tips

1. En la primera adivinanza, el programa siempre sugiere **Aire, Aire, Tierra, Tierra** como punto de partida óptimo
2. Sé preciso con el feedback - números incorrectos pueden llevar a soluciones erróneas
3. El programa te dirá cuántas combinaciones quedan después de cada intento
4. Si ves 0 combinaciones posibles, revisa el feedback anterior

## 📄 Licencia

Proyecto de Dofuspedia ES

---

¡Buena suerte resolviendo los códigos de Osamodas! 🎮✨
