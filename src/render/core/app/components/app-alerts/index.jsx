import styled from 'styled-components';
import utilHelper from "helpers/util";

const Alert = styled.div`
	padding: 7px 10px;
	border-radius: 3px;
	text-align: center;
	font-weight: bold;
	color: #fff;
	background-color: ${({color}) => utilHelper.handleColorType(color)};
`;

export default Alert;