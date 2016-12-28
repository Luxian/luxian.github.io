/**
 * Tetrimon patterns and rotation
 */

function getTetrimonPatterns(){
	return [



		// tetrimon 0: L
		[
			[
				// rotation: 0
				[ 1, 0, 0],
				[ 1, 0, 0],
				[ 1, 1, 0]
			],

			[
			 // rotation: 1
				[ 0, 0, 0],
				[ 0, 0, 1],
				[ 1, 1, 1]
			],

			[
				// rotation: 2
				[ 0, 1, 1],
				[ 0, 0, 1],
				[ 0, 0, 1]
			],

			[ // rotation: 3
				[ 1, 1, 1],
				[ 1, 0, 0],
				[ 0, 0, 0]
			]
		],




		[ // tetrimon 1: mirror L

			[
				// rotation 0
				[ 0, 0, 1],
				[ 0, 0, 1],
				[ 0, 1, 1]
			],

			[
				// rotation 1
				[ 1, 1, 1],
				[ 0, 0, 1],
				[ 0, 0, 0]
			],

			[
				// rotation 2
				[ 1, 1, 0],
				[ 1, 0, 0],
				[ 1, 0, 0]
			],

			[
				// rotation 3
				[ 0, 0, 0],
				[ 1, 0, 0],
				[ 1, 1, 1]
			]
		],



		[ // tetrimon 2: z

			[ // rotation 0
				[ 1, 1, 0],
				[ 0, 1, 1],
				[ 0, 0, 0]
			],

			[ // rotation 1
				[ 0, 1, 0],
				[ 1, 1, 0],
				[ 1, 0, 0]
			],

			[ // rotation 2
				[ 0, 0, 0],
				[ 1, 1, 0],
				[ 0, 1, 1]
			],

			[ // rotation 3
				[ 0, 0, 1],
				[ 0, 1, 1],
				[ 0, 1, 0]
			]
		],


		[ // tetrimon 3: s

			[ // rotation 0
				[ 0, 1, 1],
				[ 1, 1, 0],
				[ 0, 0, 0]
			],

			[ // rotation 1
				[ 1, 0, 0],
				[ 1, 1, 0],
				[ 0, 1, 0]
			],

			[ // rotation 2
				[ 0, 0, 0],
				[ 0, 1, 1],
				[ 1, 1, 0]
			],

			[ // rotation 3
				[ 0, 1, 0],
				[ 0, 1, 1],
				[ 0, 0, 1]
			]
		],

		[ // tetrimon 4: T

			[ // rotation 0
				[ 1, 1, 1],
				[ 0, 1, 0],
				[ 0, 0, 0]
			],

			[ // rotation 1
				[ 1, 0, 0],
				[ 1, 1, 0],
				[ 1, 0, 0]
			],

			[ // rotation 2
				[ 0, 0, 0],
				[ 0, 1, 0],
				[ 1, 1, 1]
			],

			[ // rotation 3
				[ 0, 0, 1],
				[ 0, 1, 1],
				[ 0, 0, 1]
			]
		],

		[ // tetrimon 5: square
			[
				[ 1, 1],
				[ 1, 1]
			]
		],

		[ // tetrimon 6: line

			[ // rotation 0
				[ 0, 1, 0, 0],
				[ 0, 1, 0, 0],
				[ 0, 1, 0, 0],
				[ 0, 1, 0, 0]
			],

			[ // rotation 1
				[ 0, 0, 0, 0],
				[ 1, 1, 1, 1],
				[ 0, 0, 0, 0],
				[ 0, 0, 0, 0]
			]
		]

	];
}