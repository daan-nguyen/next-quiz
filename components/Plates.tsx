import styled from "styled-components";

export const BasePlate = styled.div`
  text-align: center;
  color: #fff;
  border-radius: 2px;
  line-height: 20px;
  padding: 5px 15px;
  margin-bottom: 3px;
  margin-right: 3px;
  font-size: 14px;
`;

export const UserPlate = styled(BasePlate)`
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ScorePlate = styled(BasePlate)`
  overflow: hidden;
  transition: width 1s;
  min-width: 40px;
  text-align: right;
`;
