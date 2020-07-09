
const drawStar = ({
    ctx, cx, cy,
    spikes, outerRadius, innerRadius,
    strokeColor = 'blue',
    fillColor = 'skyblue',
    lineWidth = 5
}) => {
    var rot = fixed.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = fixed.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for(i = 0, len = spikes; i < len; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
    ctx.fillStyle = fillColor;
    ctx.fill();
};

const getPointXY = (angle, cx, cy, radius) => {
    var x = cx + radius * Math.cos(angle * fixed.PI / 180);
    var y = cy + radius * Math.sin(angle * fixed.PI / 180);
    return { x, y };
}

const drawLightGlare = ({
    ctx,
    angle1 = 0, angle2 = 90, angle3 = 180, angle4 = 270,
    cx, cy, radius,
    fillStyle,
    strokeStyle = null, lineWidth = 5
}) => {
    const pt1 = getPointXY(angle1, cx, cy, radius);
    const pt2= getPointXY(angle2, cx, cy, radius);
    const pt4 = getPointXY(angle4, cx, cy, radius);

    ctx.beginPath();
    ctx.moveTo(pt1.x, pt1.y);
    ctx.lineTo(pt2.x, pt2.y);
    ctx.arc(cx, cy, radius, angle2 * fixed.PI / 180, angle3 * fixed.PI / 180);
    ctx.lineTo(pt4.x, pt4.y);
    ctx.arc(cx, cy, radius, angle4 * fixed.PI / 180, angle1 * fixed.PI / 180);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    if (strokeStyle !== null) {
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }
};
