import React from 'react';
import ReactFauxDom from 'react-faux-dom';
import style from './Collider.css';

var d3 = require('d3');

class Collider extends React.Component {
	constructor(props) {
		super(props);

		var
		elm = d3.select(this.refs.svg),
		color = d3.scale.category10();

		this.state = {
			elm: elm,
			color: color
		};

		this.initNodes(this.props.range);
		this.resetForce();
	}

	// utility functions
	getNodes(range) {
		return d3.range(range).map((i) => {
			var
			obj = {
				x: 0,
				y: 0,
				fill: this.state.color(i % this.props.colors)
			};

			if(!i) {
				obj.radius = this.props.radiusRoot;
				obj.fixed = true;
			}

			else
			obj.radius = Math.random() * this.props.radius1 + this.props.radius2;

			return obj; 
		});
	}
	initNodes(range) {

		this.state.nodes = this.getNodes(range);
	}
	resetForce() {
		this.state.force = d3.layout.force()
    		.gravity(this.props.gravity)
    		.charge((d, i) => { return i ? 0 : this.props.charge; })
    		.nodes(this.state.nodes)
    		.size([this.props.width, this.props.height]);
    this.state.force.start();
	}
	
	// core functions
	collide(node) {
	  var r = node.radius + 16,
	      nx1 = node.x - r,
	      nx2 = node.x + r,
	      ny1 = node.y - r,
	      ny2 = node.y + r;
	  return function(quad, x1, y1, x2, y2) {
	    if (quad.point && (quad.point !== node)) {
	      var x = node.x - quad.point.x,
	          y = node.y - quad.point.y,
	          l = Math.sqrt(x * x + y * y),
	          r = node.radius + quad.point.radius;
	      if (l < r) {
	        l = (l - r) / l * .5;
	        node.x -= x *= l;
	        node.y -= y *= l;
	        quad.point.x += x;
	        quad.point.y += y;
	      }
	    }
	    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
	  };

	  console.log('collide');
	}
	mouseMove(e) {

		var
		ref = d3.select(this.refs.svg),
		elm = ref.node(),
		evt = d3.mouse(elm),

		node = this.state.nodes[0];
		node.x = evt[0];
		node.y = evt[1];

	  this.state.nodes[0] = node;
	  this.state.force.resume();
	}

	// init events
	componentWillMount() {
		this.state.force.on('tick', () => {
		  var i = 0,
		  		nodes = this.state.nodes,
		  		q = d3.geom.quadtree(nodes),
		      n = nodes.length;

		  while (++i < n) 
		  q.visit(this.collide(nodes[i]));

			this.setState({
				nodes: nodes
			});
		});
	}
	componentDidMount() {
		this.state.elm.attr('height', this.props.height);
		this.state.elm.attr('width', this.props.width);
		d3.select(this.refs.svg).on('mousemove', () => {
			this.mouseMove(this);
		});
	}

	render() {
		var nodes = this.state.nodes.map((node, i) => {
			return (
				<Node key={i} radius={node.radius} cx={node.x} cy={node.y} fill={node.fill} />
			);
		});

		return (
			<svg ref="svg" height={this.props.height} width={this.props.width}>
				{nodes}
			</svg>
		)
	}
}

Collider.defaultProps = {
	width: 960,
	height: 500,
	gravity: 0.10,
	range: 100,
	charge: -2000,
	radius1: 12,
	radius2: 4,
	radiusCollide: 16,
	radiusRoot: 0,
	colors: 3
};

class Node extends React.Component {
	componentDidMount() {
		d3.select(this.refs.circle)
			.attr('r', this.props.radius)
			.attr('fill', this.props.fill);
	}

	render() {
		return (
			<circle ref="circle" cx={this.props.cx} cy={this.props.cy}>
			</circle> 
		);
	}
}

module.exports = Collider;