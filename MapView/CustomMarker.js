import React, { Component } from 'react';
import { Image, Text, View } from  'react-native';
import { Marker } from 'react-native-maps';
import { width as w , height as h } from 'react-native-dimension';

const height = h(100);
const width = w(100);

class CustomMarker extends Component {
	shouldComponentUpdate(nextProps) {
		const { geometry, properties } = this.props;

		if (geometry === nextProps.geometry && properties.point_count === nextProps.properties.point_count) {
			return false;
		} else{
			return true;
		}
	}

	render() {
		const { geometry, properties } = this.props;
		const coordinates = {
			longitude: geometry.coordinates[0],
			latitude: geometry.coordinates[1]
		};
		const point_count = properties.point_count;

		let textForCluster = '';
		let markerWidth, markerHeight, textSize;

		if (point_count > 1 && point_count <= 10) {
			textForCluster = point_count.toString();
			markerWidth = width * 2 / 15;
			markerHeight = width * 2 / 15;
			textSize = height / 40;
		}

		if (point_count > 10 && point_count <= 25) {
			textForCluster = '10+';
			markerWidth = width / 7;
			markerHeight = width / 7;
			textSize = height / 40;
		}

		if (point_count > 25 && point_count <= 50) {
			textForCluster = '25+';
			markerWidth = width * 2 / 13;
			markerHeight = width * 2 / 13;
			textSize = height / 40;
		}

		if (point_count > 50 && point_count <= 100) {
			textForCluster = '50+';
			markerWidth = width / 6;
			markerHeight = width / 6;
			textSize = height / 38;
		}

		if (point_count > 100) {
			textForCluster = '100+';
			markerWidth = width * 2 / 11;
			markerHeight = width * 2 / 11;
			textSize = height / 38;
		}

		let marker;
		let isCluster;

		if (textForCluster !== '') {
			isCluster = 1;
			marker = (
				<View
					style={{
						borderRadius: markerWidth,
						position: 'relative',
						backgroundColor: this.props.clusterColor,
						width: markerWidth,
						height: markerHeight,
						borderWidth: this.props.clusterBorderWidth,
						borderColor: this.props.clusterBorderColor,
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Text
						style={{
							width: markerWidth,
							textAlign: 'center',
							fontSize: textSize,
							backgroundColor: 'transparent',
							color: this.props.clusterTextColor,
							fontWeight: 'bold'
						}}
					>
						{textForCluster}
					</Text>
				</View>
			);
		} else {
			isCluster = 0;
			marker = this.props.item;
		}

		if (isCluster === 1) {
			return(
				<Marker
					{...this.props}
					key={isCluster}
					coordinate={coordinates}
					onPress={() => this.props.onClusterPress(coordinates, this.props.properties.cluster_id)}
				>
					{marker}
				</Marker>
			);
		} else {
			return marker;
		}
	}
}

export default CustomMarker;