## Promts

#### Utilice Cursor

### Prompt 1

Actua como un desarrollador frontend senior experto en React. Requiero modificar mi sitio actual, que consiste en un sistema ATS, al cual me solicitaron agregar una nueva pagina en la ruta `/position` donde debo implementar un tablero tipo Kanban en las que cada columna representa una una fase del proceso de selección.

Antes que todo necesito que me sugirieras alguna librería para implementar el Kanban en React.

### Prompt 2

Entonces utilizare la librería `react-beautiful-dnd`. Como primera tarea agrega la nueva ruta a `/position/{id}`. El id correspondera al identificador del cargo (postion) a la cual el candidato postula. La ruta debería direccionar al componente @Position.tsx . El componente @Position.tsx por ahora esta vacio, agrega lo necesario para que cargue, por ahora, un texto de ejemplo

### Prompt 3

Lo siguiente es que en el componente @Positions.tsx captures el identificador que viene como Path Param, este valor se utilizara para obtener los datos de la position.

Ahora para obtener los datos necesitamos crear un servicio que consuma el siguiente endpoint:

http://localhost:3010/positions/:id/interviewFlow

El id en el endpoint corresponde al identificador que recibimos como parametro en el componente Position. Este servicio recibe la siguiente respuesta:

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

Una vez creado el servicio realiza la invocación desde el componente Position para que obtenga los datos, procura tipar la respuesta para hacer hacer mas facil el trabajo con los datos.

### Prompt 4

Tengo el siguiente error:

```
Cannot read properties of undefined (reading 'map')
TypeError: Cannot read properties of undefined (reading 'map')
    at Position (http://localhost:3000/static/js/bundle.js:1034:122)
    at renderWithHooks (http://localhost:3000/static/js/bundle.js:58862:22)
    at updateFunctionComponent (http://localhost:3000/static/js/bundle.js:62429:24)
    at beginWork (http://localhost:3000/static/js/bundle.js:64148:20)
    at HTMLUnknownElement.callCallback (http://localhost:3000/static/js/bundle.js:49118:18)
    at Object.invokeGuardedCallbackDev (http://localhost:3000/static/js/bundle.js:49162:20)
    at invokeGuardedCallback (http://localhost:3000/static/js/bundle.js:49219:35)
    at beginWork$1 (http://localhost:3000/static/js/bundle.js:69117:11)
    at performUnitOfWork (http://localhost:3000/static/js/bundle.js:68365:16)
    at workLoopSync (http://localhost:3000/static/js/bundle.js:68288:9)
```

### Prompt 5

Esta es la respuesta del servidor:

```
{
    "interviewFlow": {
        "positionName": "Senior Full-Stack Engineer",
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
}
```

### Prompt 6

Tengo este error:

```
TS2339: Property 'interviewSteps' does not exist on type '{ positionName: string; interviewFlow: { id: number; description: string; interviewSteps: InterviewStep[]; }; }'.
    61 |             <h2>Paso de Entrevistas</h2>
    62 |             <ul>
  > 63 |                 {interviewFlow.interviewFlow.interviewSteps.map((step) => (
       |                                              ^^^^^^^^^^^^^^
    64 |                     <li key={step.id}>{step.name}</li>
    65 |                 ))}
    66 |             </ul>
```

### Prompt 7

Bien, ahora que ya tenemos los datos necesito construir el Kanban, donde cada columna corresponde a los interviewSteps que obtenemos en la respuesta del servicio. En la cebecera de la columna debería estar el name de cada etapa y las columnas deben estar ordenadas por el orderIndex del InterviewStep. Recuerda que vamos a utilizar react-beautiful-dnd para mover los candidatos entre cada unas de las etapas, pero por ahora contruye solo las columnas de cada etapa.

### Prompt 8

Puedes centrar las columnas para que esten solo separadas por un margen de unos 30px?

### Prompt 9

Perfecto, ahora para cargar los candidatos debemos agregar otra invocación al endpoint:

http://localhost:3010/position/:id/candidates

Donde el id es el identificador de position y la respuesta es esta:

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

Por ahora realiza la invocación y solo imprime por consola el resultado.

### Prompt 10

Esta es la respuesta del servicio:

```
[
    {
        "fullName": "John Doe",
        "currentInterviewStep": "Technical Interview",
        "averageScore": 5
    },
    {
        "fullName": "Jane Smith",
        "currentInterviewStep": "Technical Interview",
        "averageScore": 4
    },
    {
        "fullName": "Carlos García",
        "currentInterviewStep": "Initial Screening",
        "averageScore": 0
    }
]
```

Agrega el tipado de datos y ademas necesito que las tarjetas en las columnas correspondientes haciendo match con la propiedad `currentInterviewStep` y el `name` de cada columna. Cada candidato se debe presentar como un tarjeta (tal como la imagen) y debe tener la posibilidad de moverlas entre las columnas con la acción de drag and drop. Cada vez que muevas una de las tarjetas entre las columnas, deberías gatillar un evento que capture los datos de la columna y los de la tarjeta, por ahora solo imprime los datos en la consola.

### Prompt 11

En cada una de las tarjetas considera agregara, como en la imagen, la cantidad de circulos de acuerdo al `averageScore` de cada candidato.

### Prompt 12

Tengo un error en la implementación:

```
Invariant failed: Cannot find droppable entry with id [2]
    at handleError (http://localhost:3000/static/js/bundle.js:94458:58)
    at http://localhost:3000/static/js/bundle.js:94477:7
```

-   Itere bastante para corregir el drag and drop, así que inicie un conversación nueva y cambie el LLM de gpt-4o-mini a claude-3.5-sonnet

### Prompt 13

Estoy implementando un tablero tipo Kanban para le proceso de selección de un sistema ATS. El componente @Position.tsx recibe un identificador como path param para obtener los datos del cargo (position) que quiero gestionar y además las etapas del proceso de selección, donde cada una de ellas corresponde a una columna del Kanban. Cada una de las tarjetas del Kanban corresponde a un postulante y debería poder moverlos entre cada una de las columnas con la acción de drag and drop.

Para la implementación del drag and drop estoy utilizando la librería `react-beautiful-dnd`. LO que tengo actualmente es el tablero con las tarjetas visibles, pero no me es posible arrastrar entre las distintas columnas.

### Prompt 14

Tengo el siguiente mensaje en la consola al hacer click en las tarjetas:

Unable to find draggable with id: 6353df5d-c6ab-4a6d-9811-cf384e6375ce

### Prompt 15

Creo que el React.StrictMode es el que no me permite arrastrar las tarjetas

### Prompt 16

Revisa el correcto funcionamiento del drag a drop, ya que al mover las tarjetas se en momentos no la tarjeta no queda en la columna que la deje. Al momento de mover una tarjeta se debería actualizar el candidato con los datos de la nueva columna en la que esta.

### Prompt 17

A pesar que el candidato se esta actualizando, lo veo en el log, se queda en la misma columna de origen.

### Prompt 18

Ahora funciona perfecto, necesito ahora que quites el titulo "Paso de Entrevistas". También necesito que el diseño del tablero se vea similar a la imagen. Ajusta los tamaños de los textos y colores se vean similar a la imagen.

Por ultimo agrega un botón para volver a la pagina anterior, que se ajuste al diseño del sitio.

### Prompt 19

Manteniendo el diseño, puedes alinear las columnas hacia la izquiera pero que las separece un pequño margen

### Prompt 20

En el componente @Positions.tsx hay un botón `Ver Proceso` que debería direccionar al nuevo componente, por ahora deja en duro el identificador del cargo o position ID 1.
