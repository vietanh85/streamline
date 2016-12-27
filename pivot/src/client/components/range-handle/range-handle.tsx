/*
 * Copyright 2015-2016 Imply Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('./range-handle.css');

import * as React from 'react';
import { getXFromEvent, classNames, clamp } from '../../utils/dom/dom';

export interface RangeHandleProps extends React.Props<any> {
  positionLeft: number;
  onChange: (x: number) => void;
  offset: number;
  isAny: boolean;
  isBeyondMin?: boolean;
  isBeyondMax?: boolean;
  rightBound?: number;
  leftBound?: number;
}

export interface RangeHandleState {
  anchor: number;
}

export class RangeHandle extends React.Component<RangeHandleProps, RangeHandleState> {
  public mounted: boolean;

  constructor() {
    super();
    this.state = {
      anchor:  null
    };

    this.onGlobalMouseUp = this.onGlobalMouseUp.bind(this);
    this.onGlobalMouseMove = this.onGlobalMouseMove.bind(this);
  }

  onGlobalMouseMove(event: MouseEvent) {
    const { onChange, leftBound, rightBound } = this.props;
    const { anchor } = this.state;
    let newX = getXFromEvent(event) - anchor;

    onChange(clamp(newX, leftBound, rightBound));
  }

  onMouseDown(event: MouseEvent) {
    const { offset, positionLeft } = this.props;

    let x = getXFromEvent(event);
    var anchor = x - offset - positionLeft;

    this.setState({
      anchor
    });

    event.preventDefault();
    window.addEventListener('mouseup', this.onGlobalMouseUp);
    window.addEventListener('mousemove', this.onGlobalMouseMove);

  }

  onGlobalMouseUp() {
    window.removeEventListener('mouseup', this.onGlobalMouseUp);
    window.removeEventListener('mousemove', this.onGlobalMouseMove);
  }

  render() {
    const { positionLeft, isAny, isBeyondMin, isBeyondMax } = this.props;

    var style = { left: positionLeft };

    return <div
      className={classNames("range-handle", { empty: isAny, "beyond min": isBeyondMin, "beyond max": isBeyondMax })}
      style={style}
      onMouseDown={this.onMouseDown.bind(this)}
    />;
  }
}