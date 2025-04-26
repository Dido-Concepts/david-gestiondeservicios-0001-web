'use strict'

/**
 * Helper function to get base filename.
 * @param {string | undefined} filename The full path to the file.
 * @returns {string} The base name of the file or a placeholder.
 */
function getBaseFilename (filename) {
  // Añadir verificación por si filename no es string
  if (typeof filename !== 'string') {
    return 'unknown_file'
  }
  const parts = filename.split(/[\\/]/)
  return parts[parts.length - 1]
}

// Exportamos un objeto donde cada clave es un nombre de regla
module.exports = {
  // Esta es la clave para tu regla
  'require-reflect-metadata': {
    meta: {
      type: 'problem',
      docs: {
        description: "Require 'import \"reflect-metadata\"' in files ending with -implementation.repository.ts and auto-fix it.", // Descripción actualizada
        category: 'Best Practices',
        recommended: 'error'
      },
      fixable: 'code', // <--- ¡CAMBIO IMPORTANTE! Habilita el auto-fix
      schema: [],
      messages: {
        missingReflectMetadata: "El archivo '{{ filename }}' debe importar 'reflect-metadata' porque coincide con el patrón '*-implementation.repository.ts' ya que se usa para la inyección de dependencias."
      }
    },

    create (context) {
      let hasReflectMetadataImport = false
      const fullFilename = context.filename || context.getFilename()
      const baseFilename = getBaseFilename(fullFilename)

      if (typeof fullFilename !== 'string' || !fullFilename.endsWith('-implementation.repository.ts')) {
        return {}
      }

      return {
        ImportDeclaration (node) {
          if (
            node.specifiers && node.specifiers.length === 0 &&
                        node.source && node.source.type === 'Literal' &&
                        node.source.value === 'reflect-metadata'
          ) {
            hasReflectMetadataImport = true
          }
        },

        'Program:exit' (programNode) {
          if (!hasReflectMetadataImport) {
            // Cuando el import falta, reportamos el error Y proporcionamos el fix
            context.report({
              node: programNode.body && programNode.body.length > 0 ? programNode.body[0] : programNode,
              messageId: 'missingReflectMetadata',
              data: {
                filename: baseFilename
              },
              // --- ¡AÑADIDO! ---
              // Función que describe cómo arreglar el código
              fix: function (fixer) {
                // Insertamos el texto del import al principio del archivo (posición 0).
                // Añadimos '\n' para que se inserte en una nueva línea.
                return fixer.insertTextBeforeRange([0, 0], "import 'reflect-metadata';\n")
              }
            })
          }
        }
      }
    }
  }
}
