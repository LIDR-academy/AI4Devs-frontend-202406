# Problemas y comentarios

En el enunciado cita los endpoint
- `GET /positions/:id/interviewFlow`: No estaba en el api-spec.yaml
- `GET /positions/:id/candidates`: En el api-spec.yaml y en el código está como `/position/:id/candidates` (sin la *s* final)
- `PUT /candidates/:id/stage`: Está definido en el api-spec y en el código sin el path `/stage`


# Prompt inicial (cursor.sh)

## Prompt
Eres un programador experto en frontend con framework React.js. Necesitamos añadir una nueva página para visualizar y gestionar los diferentes candidatos de una posición específica.

# Descripción
- Añadir un enlace desde la pantalla de '/positions' al pulsar en el botón "Ver proceso" que rediriga a la página de detalle del proceso
- Esta página visualizará las diferentes fases del proceso en un tablero Kanban.
- Cada columna representará una fase del proceso de contratación
- En cada columna se mostrará los candidatos como tarjetas
- Se podrá actualizar la fase en la que se encuentra el candidato solo arrastrando su tarjeta

# Diseño
Adjunto una imagen con el ejemplo de interfaz posible.

- Se debe mostrar el título de la posición en la parte superior, para dar contexto
- Añadir una flecha a la izquierda del título que permita volver al listado de posiciones
- Deben mostrarse tantas columnas como fases haya en el proceso
- La tarjeta de cada candidato/a debe situarse en la fase correspondiente, y debe mostrar su nombre completo y su puntuación media
- Debe ser responsive, para mostrarse adecuadamente en móvil (las fases en vertical ocupando todo el ancho)

## Observaciones
- Asume que la página de posiciones la encuentras 
- Asume que existe la estructura global de la página, la cual incluye los elementos comunes como menú superior y footer. Lo que estás creando es el contenido interno de la página.

# Integraciones
Para implementar la funcionalidad de la página cuentas con diversos endpoints API que ha preparado el equipo de backend en el módulo "backend".

## GET /positions/:id/interviewFlow
Este endpoint devuelve información sobre el proceso de contratación para una determinada posición (query param "id"):
- `positionName`: Título de la posición
- `interviewSteps`: id y nombre de las diferentes fases de las que consta el proceso de contratación

### Ejemplo de respuesta:
```
{
      "positionName": "Senior backend engineer",
      "interviewFlow": {
              
              "id": 1,
              "description": "Standard development interview process",
              "interviewSteps": [
                  {
                      "id": 1,
                      "interviewFlowId": 1,
                      "interviewTypeId": 1,
                      "name": "Initial Screening",
                      "orderIndex": 1
                  },
                  {
                      "id": 2,
                      "interviewFlowId": 1,
                      "interviewTypeId": 2,
                      "name": "Technical Interview",
                      "orderIndex": 2
                  },
                  {
                      "id": 3,
                      "interviewFlowId": 1,
                      "interviewTypeId": 3,
                      "name": "Manager Interview",
                      "orderIndex": 2
                  }
              ]
          }
  }
```

## GET /positions/:id/candidates
Este endpoint devuelve todos los candidatos en proceso para una determinada posición (query param "id"), es decir, todas las aplicaciones para un determinado positionID. 
Proporciona la siguiente información:
- name: Nombre completo del candidato
- current_interview_step: en qué fase del proceso está el candidato.
- score: La puntuación media del candidato

### Ejemplo de respuesta:
```
[
      {
           "fullName": "Jane Smith",
           "currentInterviewStep": "Technical Interview",
           "averageScore": 4
       },
       {
           "fullName": "Carlos García",
           "currentInterviewStep": "Initial Screening",
           "averageScore": 0            
       },        
       {
           "fullName": "John Doe",
           "currentInterviewStep": "Manager Interview",
           "averageScore": 5            
      }    
 ]
```

## PUT /candidates/:id/stage
Este endpoint actualiza la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico, a través del parámetro "new_interview_step" y proporionando el interview_step_id correspondiente a la columna en la cual se encuentra ahora el candidato.

### Ejemplo de cuerpo de la petición
```
{
     "applicationId": "1",
     "currentInterviewStep": "3"
 }
```

### Ejemplo de respuesta
```
{    
    "message": "Candidate stage updated successfully",
     "data": {
         "id": 1,
         "positionId": 1,
         "candidateId": 1,
         "applicationDate": "2024-06-04T13:34:58.304Z",
         "currentInterviewStep": 3,
         "notes": null,
         "interviews": []    
     }
 }
 ```

## Respuesta usando Claude 3.5 (con contexto global)


### Fix 1

El campo para montar el enlace al detalle de la posición debe contener el ID de la posición. utiliza @api-spec.yaml  o el código para saber el ID del proceso en este caso

### Fix 2:

Puedes solucionar este error?
Failed to compile.

Module not found: Error: Can't resolve 'react-beautiful-dnd' in '/home/jmlopez/dev/jmlclosa/AI4Devs-frontend/frontend/src/components'
WARNING in [eslint] 
src/components/KanbanBoard.js
  Line 41:13:  'source' is assigned a value but never used  no-unused-vars

ERROR in ./src/components/KanbanBoard.js 8:0-76
Module not found: Error: Can't resolve 'react-beautiful-dnd' in '/home/jmlopez/dev/jmlclosa/AI4Devs-frontend/frontend/src/components'

webpack compiled with 1 error and 1 warning
Files successfully emitted, waiting for typecheck results...
Issues checking in progress...

### Fix 3: Completar api-spec.yaml con el endpoint `GET /position/:id/interviewFlow`
```
Faltan las definiciones de 2 endpoints que están implementados en "backend":
- GET /position/:id/interviewFlow
- PUT /candidates/:id
```

### Fix manual
> Se corrige manualmente las URL en `KanbanBoard.js`


### Fix URL del backend:
```
La URL completa del servicio de backend es "http://localhost:3010" pero se está haciendo las peticiones a "http://localhost:3000" porque no se incluye el host en las peticiones de Axios. 
Puedes corregirlo? Aplica buenas prácticas en la gestión de este tipo de URL
```

Respuesta:
```
...
Resumen
1. Crear un archivo .env con la URL del backend.
2. Configurar Axios para usar la URL base del backend en un archivo axiosConfig.js.
3. Actualizar las peticiones Axios en los componentes para usar la instancia configurada.
```

### Fix 2 URL del backend: 
```
Las peticiones siguen haciendose al puerto :3000
Tengo que configurar algo para leer ese fichero .env?
Estoy arrancando el proyecto con la siguiente instrucción: `npm run build && npm start`
```

### Fix error al cargar el detalle de posición en el navegador

```
Al acceder a la URL: localhost:3000/positions/1/kanban tengo el siguiente error:

Uncaught runtime errors:
×
ERROR
Cannot read properties of undefined (reading 'map')
TypeError: Cannot read properties of undefined (reading 'map')
    at KanbanBoard (http://localhost:3000/static/js/bundle.js:1141:34)
    at renderWithHooks (http://localhost:3000/static/js/bundle.js:66914:22)
    at updateFunctionComponent (http://localhost:3000/static/js/bundle.js:70481:24)
    at beginWork (http://localhost:3000/static/js/bundle.js:72200:20)
    at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:57170:18)
    at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:57214:20)
    at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:57271:35)
    at beginWork$1 (http://localhost:3000/static/js/bundle.js:77169:11)
    at performUnitOfWork (http://localhost:3000/static/js/bundle.js:76417:16)
    at workLoopSync (http://localhost:3000/static/js/bundle.js:76340:9)
ERROR
Cannot read properties of undefined (reading 'map')
TypeError: Cannot read properties of undefined (reading 'map')
    at KanbanBoard (http://localhost:3000/static/js/bundle.js:1141:34)
    at renderWithHooks (http://localhost:3000/static/js/bundle.js:66914:22)
    at updateFunctionComponent (http://localhost:3000/static/js/bundle.js:70481:24)
    at beginWork (http://localhost:3000/static/js/bundle.js:72200:20)
    at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:57170:18)
    at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:57214:20)
    at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:57271:35)
    at beginWork$1 (http://localhost:3000/static/js/bundle.js:77169:11)
    at performUnitOfWork (http://localhost:3000/static/js/bundle.js:76417:16)
    at workLoopSync (http://localhost:3000/static/js/bundle.js:76340:9)
ERROR
Cannot read properties of undefined (reading 'map')
TypeError: Cannot read properties of undefined (reading 'map')
    at KanbanBoard (http://localhost:3000/static/js/bundle.js:1141:34)
    at renderWithHooks (http://localhost:3000/static/js/bundle.js:66914:22)
    at updateFunctionComponent (http://localhost:3000/static/js/bundle.js:70481:24)
    at beginWork (http://localhost:3000/static/js/bundle.js:72200:20)
    at beginWork$1 (http://localhost:3000/static/js/bundle.js:77147:18)
    at performUnitOfWork (http://localhost:3000/static/js/bundle.js:76417:16)
    at workLoopSync (http://localhost:3000/static/js/bundle.js:76340:9)
    at renderRootSync (http://localhost:3000/static/js/bundle.js:76313:11)
    at recoverFromConcurrentError (http://localhost:3000/static/js/bundle.js:75805:24)
    at performConcurrentWorkOnRoot (http://localhost:3000/static/js/bundle.js:75718:26)
```

Respuesta
```
The error message indicates that the `interviewSteps` array is `undefined` when the `map` function is called on it. This likely means that the data fetching hasn't completed or failed, and the component is trying to render before the data is available.

To fix this, you can add a check to ensure that `interviewSteps` is defined before attempting to map over it. You can also add a loading state to handle the asynchronous data fetching more gracefully.

Here's how you can modify the `KanbanBoard` component to include these checks:

...
...

In this updated code:

1. A `loading` state is added to manage the loading state of the component.
2. The `fetchData` function is introduced to fetch both interview flow and candidates data, and set the loading state to `false` once the data is fetched.
3. A loading message is displayed while the data is being fetched.
4. The `interviewSteps.map` function is only called if `interviewSteps` is defined and the data has been fetched.
```

### Sigue sin funcionar
```
Donde se comprueba que `interviewStep` esté definido?
```

### Fix **manual** para solucionar petición a `/position/:id/interviewFlow`
El backend está devolviendo los `interviewSteps` en la variable `response.data.interviewFlow.interviewFlow.interviewSteps` en vez de `response.data.interviewFlow.interviewSteps` debido al código en `positionController.ts:22` hace: `res.status(200).json({ interviewFlow });`

### Fix para resolver problema Draggable
```
Al acceder a la pantalla no puedo mover las tarjetas de columna y aparece el siguiente error en la consola del navegador:

Warning: Each child in a list should have a unique "key" prop. KanbanBoard.js:102
```

```
Ahora aprece el siguiente error:

Unable to find draggable with id: undefined

Debe ser debido a que la respuesta de los candidatos no contiene el campo `id` y por tanto `candidate.id` no es válido. 
Ejemplo de respuesta al endpoint de /position/:id/candidate:

[
    {
        "averageScore": 4,
        "currentInterviewStep": "Technical Interview",
        "fullName": "Jane Smith"
    },
    {
        "averageScore": 0,
        "currentInterviewStep": "Initial Screening",
        "fullName": "Carlos García"
    },
    {
        "averageScore": 5,
        "currentInterviewStep": "Manager Interview",
        "fullName": "John Doe"
    }
]
```

```
Sigue apareciendo el error:
Unable to find draggable with id: carlos-garcía
```

```
Sigue apareciendo el error:

Unable to find draggable with id: candidate-0-jane-smith

¿Puedes revisar la documentación del componente Draggable y ver si lo estamos utilizando bien?
```

```
Para qué sirve el campo "droppableId" de Droppable?
Y el campo "draggableId" de Draggable?

Explicame como funcionan estos componentes de ReactJS.
```

```
Puedes darme un ejemplo que no use variables externas de un elemento DragDropContext con 3 elementos Droppable y 1 elemento Draggable por cada Droppable?
Quiero sustituir la funcionalidad actual por este ejemplo en KanbanBoard.js pero sin usar variables, solo valores hardcoded.
```

```
Sigue dando error:

Unable to find draggable with id: item-1
```

```
Sigue pasando lo mismo. Podemos añadir algún log que capture el evento antes de que se produzca el error?
```

```
Vamos a simplificar más el ejemplo: Solo 2 columnas y un elemento que aparezca en la primera columna.
Este elemento debe poderse mover entre las dos columnas.
```

```
Aparece el mismo error. 
El log que se muestra es:
```
Initial column state: {
    "column-1": {
        "id": "column-1",
        "title": "To Do",
        "items": [
            {
                "id": "task-1",
                "content": "Task 1"
            }
        ]
    },
    "column-2": {
        "id": "column-2",
        "title": "Done",
        "items": []
    }
}
```

También un warning: Warning: Connect(Droppable): Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead
```


# IMPOSIBLE! Borramos KanbanBoard.js y abrimos nuevo chat

# Prompt lanzado a Claude 3.5

Eres un programador experto en frontend con framework React.js. Necesitamos crear un componente para visualizar y gestionar los diferentes candidatos de una posición específica.
Este componente se debe crear en el fichero @KanbanBoard.js, ahora vacío.

# Descripción
- Esta página visualizará las diferentes fases del proceso en un tablero Kanban.
- Cada columna representará una fase del proceso de contratación
- En cada columna se mostrará los candidatos como tarjetas
- Se podrá actualizar la fase en la que se encuentra el candidato solo arrastrando su tarjeta

# Diseño
Adjunto una imagen con el ejemplo de interfaz posible en el fichero process_detail.avif

- Se debe mostrar el título de la posición en la parte superior, para dar contexto
- Añadir una flecha a la izquierda del título que permita volver al listado de posiciones
- Deben mostrarse tantas columnas como fases haya en el proceso
- La tarjeta de cada candidato/a debe situarse en la fase correspondiente, y debe mostrar su nombre completo y su puntuación media
- Debe ser responsive, para mostrarse adecuadamente en móvil (las fases en vertical ocupando todo el ancho)

## Observaciones
- Asume que la página de posiciones la encuentras 
- Asume que existe la estructura global de la página, la cual incluye los elementos comunes como menú superior y footer. Lo que estás creando es el contenido interno de la página.

# Integraciones
Para implementar la funcionalidad de la página cuentas con diversos endpoints API que ha preparado el equipo de backend en el módulo "backend".
Este módulo backend está en localhost:3010. Utiliza la variable de entorno y los ficheros de configuración axios ya creados en el proyecto.

## GET /position/:id/interviewFlow
Este endpoint devuelve información sobre el proceso de contratación para una determinada posición (query param "id"):
- `positionName`: Título de la posición
- `interviewSteps`: id y nombre de las diferentes fases de las que consta el proceso de contratación

### Ejemplo de respuesta:
```
{
    "interviewFlow": {
        "description": "Standard development interview process",
        "id": 1,
        "interviewSteps": [
            {
                "id": 1,
                "interviewFlowId": 1,
                "interviewTypeId": 1,
                "name": "Initial Screening",
                "orderIndex": 1
            },
            {
                "id": 2,
                "interviewFlowId": 1,
                "interviewTypeId": 2,
                "name": "Technical Interview",
                "orderIndex": 2
            },
            {
                "id": 3,
                "interviewFlowId": 1,
                "interviewTypeId": 3,
                "name": "Manager Interview",
                "orderIndex": 2
            }
        ]
    },
    "positionName": "Senior Full-Stack Engineer"
}

```

## GET /position/:id/candidates
Este endpoint devuelve todos los candidatos en proceso para una determinada posición (query param "id"), es decir, todas las aplicaciones para un determinado positionID. 
Proporciona la siguiente información:
- name: Nombre completo del candidato
- current_interview_step: en qué fase del proceso está el candidato.
- score: La puntuación media del candidato

### Ejemplo de respuesta:
```
[
    {
        "averageScore": 4,
        "currentInterviewStep": "Technical Interview",
        "fullName": "Jane Smith"
    },
    {
        "averageScore": 0,
        "currentInterviewStep": "Initial Screening",
        "fullName": "Carlos García"
    },
    {
        "averageScore": 5,
        "currentInterviewStep": "Manager Interview",
        "fullName": "John Doe"
    }
]

```

## PUT /candidates/:id
Este endpoint actualiza la etapa del candidato movido. Permite modificar la fase actual del proceso de entrevista en la que se encuentra un candidato específico, a través del parámetro "new_interview_step" y proporionando el interview_step_id correspondiente a la columna en la cual se encuentra ahora el candidato.

### Ejemplo de cuerpo de la petición
```
{
     "applicationId": "1",
     "currentInterviewStep": "3"
 }
```

### Ejemplo de respuesta
```
{    
    "message": "Candidate stage updated successfully",
     "data": {
         "id": 1,
         "positionId": 1,
         "candidateId": 1,
         "applicationDate": "2024-06-04T13:34:58.304Z",
         "currentInterviewStep": 3,
         "notes": null,
         "interviews": []    
     }
 }
 ``` 


 ## Respuesta de Claude CON MISMO ERROR

 # Repetimos el prompt anterior a o1-mini

 Sigue dando el mismo error

 ## Intentamos corregir
 ```
 Cuando accedo a la pantalla y pulso para arrastrar una tarjeta de un candidato, sale el siguiente error en la consola:

Unable to find draggable with id: 0-jane-smith
```




**La solución tampoco funciona**