### X3D Viewer Example

This is a standard ReactJS web application. In order to run it locally you should run these steps

1.	`git clone git@bitbucket.org:elad3d/x3d-examples-and-uecases.git`
2.	`cd x3d-examples-and-uecases`
3.	`npm install`
4.	`npm start`
5. 	Open localhost:3000 in your WebGL-enabled browser

## Component interface
- The X3D Viewer component will receive 4 props as input
	- conf: this is the parsed JSON file (defined below)
	- clickHandler: the handler for the click event
	- mouseoverHandler: the handler for the mouseover event
	- mouseoutHandler: the handler for the mouseout event

\* _All events receive a payload obj including the targeted Shape and it's own errors. Targeted Shape elements are only those which are referenced by errors in the json file_

Payload definition:

```
	{	
		id: string, 
		color: string, // rgb 256 css format
		errors: 
			{
				errorId: string,
				name: string, 
				description: string, 
				visible: boolean
			}[]
	}
```


Example:

```

const clickHandler = useCallback(
	(payload) => {
		setActive(payload);
	},[]
)

(...)

<MyX3DViewer 
	conf={conf} 
	mouseoutHandler={mouseoutHandler}
	mouseoverHandler={mouseoverHandler}
	clickHandler={clickHandler}></MyX3DViewer>

```

-----------

#### X3D Object specifications
- Objects must be formed by Shape elements. 
- Each Shape must include the Material element within this path: Shape>Appearance>Material, in order to get "painted" by errors.
- Shapes are identified by the DEF attribute

##### X3D Object File - Content Example

```

<X3D xmlns:xsd="http://www.w3.org/2001/XMLSchema-instance" profile="Interchange" version="3.3">
	<Scene>
		<Group DEF="faces">
			<Shape DEF="face1">
				<Appearance>
				<Material DEF="matface1" />
				</Appearance>
				<IndexedTriangleSet DEF="setface1" index=" 1 2 0 1 3 2  ">
				<Coordinate point=" 0 0 0 0 0 1 0 1 0 0 1 1 " />
				<Normal vector=" -1 0 0 -1 0 0 -1 0 0 -1 0 0 " />
				</IndexedTriangleSet>
			</Shape>
			<Shape DEF="face2">
				<Appearance>
				<Material DEF="matface2" />
				</Appearance>
				<IndexedTriangleSet DEF="setface2" index=" 1 0 2 1 2 3  ">
				<Coordinate point=" 1 0 0 1 0 1 1 1 0 1 1 1 " />
				<Normal vector=" 1 -0 -0 1 -0 -0 1 -0 -0 1 -0 -0 " />
				</IndexedTriangleSet>
			</Shape>
			<Shape DEF="face3">
				<Appearance>
				<Material DEF="matface3" />
				</Appearance>
				<IndexedTriangleSet DEF="setface3" index=" 3 0 1 3 2 0  ">
				<Coordinate point=" 0 0 0 1 0 0 0 0 1 1 0 1 " />
				<Normal vector=" 0 -1 -0 0 -1 -0 0 -1 -0 0 -1 -0 " />
				</IndexedTriangleSet>
			</Shape>
			<Shape DEF="face4">
				<Appearance>
				<Material DEF="matface4" />
				</Appearance>
				<IndexedTriangleSet DEF="setface4" index=" 3 1 0 3 0 2  ">
				<Coordinate point=" 0 1 0 1 1 0 0 1 1 1 1 1 " />
				<Normal vector=" -0 1 0 -0 1 0 -0 1 0 -0 1 0 " />
				</IndexedTriangleSet>
			</Shape>
			<Shape DEF="face5">
				<Appearance>
				<Material DEF="matface5" />
				</Appearance>
				<IndexedTriangleSet DEF="setface5" index=" 3 0 1 3 2 0  ">
				<Coordinate point=" 0 0 0 0 1 0 1 0 0 1 1 0 " />
				<Normal vector=" -0 0 -1 -0 0 -1 -0 0 -1 -0 0 -1 " />
				</IndexedTriangleSet>
			</Shape>
			<Shape DEF="face6">
				<Appearance>
				<Material DEF="matface6" />
				</Appearance>
				<IndexedTriangleSet DEF="setface6" index=" 3 1 0 3 0 2  ">
				<Coordinate point=" 0 0 1 0 1 1 1 0 1 1 1 1 " />
				<Normal vector=" 0 -0 1 0 -0 1 0 -0 1 0 -0 1 " />
				</IndexedTriangleSet>
			</Shape>
		</Group>
	</Scene>
</X3D>

```



#### JSON Conf specifications
- The configuration file must contain a URL pointing to .x3d file including (if necessary) APP TOKEN as query or path param.
- The component expects all the file info as a JSON Object, not the file itself
- In order to hide/show errors dinamically, the conf object parsed from the file must be updated for the component to refresh shape colors
- The configuration is also expected to have a `showAxis` flag in order to toggle the axis visibility
- For the rendered object to be viewed in different positions, a list of viewpoints should be provided to the component, which will show a list of options for the user to choose

#### JSON Conf Error lines
- In each error/message line of the file, the visible attribute indicated whether the shape gets painted or not
- Each line may point to one or more *Shapes*, referencing them with the correspondent DEF atribute within the ids value.
- When a Shape is referenced by more than one visible error item, colors are calculared as average using each RGB value.

##### JSON Configuration - expected format

```

{
	"id": string,
	"url": string,
	"showXYZ": boolean,
	"boundingBox": {
		"xmin": number, 
		"xmax": number, 
		"ymin": number, 
		"ymax": number,
		"zmin": number,
		"zmax": number
	},
	"cog": {
        "x": number,
        "y": number,
        "z": number
    },
	"errors": [
		{ 
			"id": string, 
			"name": string, 
			"desc": string, 
			"color": number[], // [0-1, 0-1, 0-1] 
			"visible": boolean, 
			"ids": string[] 
		}
	]
	"viewpoints": [
		{
			"id": string,
			"name": string,
			"position": string,
			"orientation": string,
			"zNear": number, //optional
			"zFar": number //optional
		}
	]
	
}

```

#### JSON Configuration - example

```

{
	"id": "35234523452",
	"url": "model.x3d",
	"showXYZ": true,
	"boundingBox": {
		"xmin": 0, 
		"xmax": 1, 
		"ymin": 0, 
		"ymax": 1, 
		"zmin": 0, 
		"zmax": 1
	},
    "showXYZ": true,
	"errors": [
		{ 
			"id": "err1", 
			"name": "ERR", 
			"desc":"Shape doesn't comply with specs", 
			"color": [0.737374, 0.1111, 0.243245676543], 
			"visible": true, 
			"ids": ["face1", "face4"] 
		},
		{ 
			"id": "err2", 
			"name": "WAR", 
			"desc": "Material is too thick", 
			"color": [0.22112121, 0.65445, 0.5345], 
			"visible": true, 
			"ids": ["face3"] 
		},
		{ 
			"id": "err3", 
			"name": "INF", 
			"desc": "Not really heat friendly", 
			"color": [0.43543, 0, 0.9948443], 
			"visible": true, 
			"ids": ["face2", "face4"] 
		},
		{ 
			"id": "err4", 
			"name": "CUS", 
			"desc": "This part could be split in two for better rotation", 
			"color": [0.0112, 0.1, 0.945], 
			"visible": true, 
			"ids": ["face6"] 
		}
	],
	viewpoints: [
		{
			"id": "default",
			"name": "Best defect view",
			"position": "-1.94639 1.79771 -2.89271", 
			"orientation": "0.03886 0.99185 0.12133 3.75685" ,
			"zNear": "1.68178" ,
			"zFar": "6.53435"
		}
	]
}

```


