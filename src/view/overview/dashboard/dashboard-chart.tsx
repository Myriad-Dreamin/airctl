import { Chart, registerShape } from '@antv/g2';

// 自定义Shape 部分
registerShape('point', 'pointer', {
    draw(cfg, container) {
        const group = container.addGroup();
        const center = (this as any).parsePoint({ x: 0, y: 0 }); // 获取极坐标系下画布中心点
        // 绘制指针
        group.addShape('line', {
            attrs: {
                x1: center.x,
                y1: center.y,
                x2: cfg.x,
                y2: cfg.y,
                stroke: cfg.color,
                lineWidth: 1,
                lineCap: 'round',
            },
        });
        group.addShape('circle', {
            attrs: {
                x: center.x,
                y: center.y,
                r: 2,
                stroke: cfg.color,
                lineWidth: 1,
                fill: '#fff',
            },
        });

        return group;
    },
});

export function chartMain(hook: HTMLElement, totalValue: number, actualValue: number) {
    let fmt: (v: unknown) => {};
    let tickScale: number;
    let scaledValue: number;
    let maxValue: number;
    const chart = new Chart({
        container: hook,
        autoFit: true,
        padding: [0, 0, 30, 0],
    });

    if (totalValue % 3 == 0) {
        tickScale = totalValue / 3;
        scaledValue = actualValue;
        maxValue = totalValue;
        fmt = (v) => {
            return `${v}`;
        };
        chart.scale('value', {
            min: 0,
            max: totalValue,
            tickInterval: tickScale,
        });
        chart.data([{ value: actualValue }]);
    } else if (totalValue % 5 == 0) {
        tickScale = totalValue / 5;
        scaledValue = actualValue;
        maxValue = totalValue;
        fmt = (v) => {
            return `${v}`;
        };
        chart.scale('value', {
            min: 0,
            max: maxValue,
            tickInterval: tickScale,
        });
        chart.data([{ value: actualValue }]);
    } else {
        tickScale = totalValue / 10.0;
        scaledValue = (actualValue / totalValue) * 10;
        maxValue = 10;
        chart.scale('value', {
            min: 0,
            max: maxValue,
            tickInterval: 1,
        });
        fmt = (v: unknown) => {
            if ((v as number) & 1) {
                return '';
            }
            return `${((v as number) * tickScale).toFixed(1)}`;
        };
        chart.data([{ value: scaledValue }]);
    }
    chart.coordinate('polar', {
        startAngle: (-9 / 8) * Math.PI,
        endAngle: (1 / 8) * Math.PI,
        radius: 0.75,
    });

    chart.axis('1', false);
    chart.axis('value', {
        line: null,
        label: {
            offset: -10,
            style: {
                fontSize: 12,
                textAlign: 'center',
                textBaseline: 'middle',
            },

            formatter: fmt,
        },
        subTickLine: {
            count: 4,
            length: -4,
        },
        tickLine: {
            length: -6,
        },
        grid: null,
    });
    chart.legend(false);
    chart
        .point()
        .position('value*1')
        .shape('pointer')
        .color('#1890FF')
        .animate({
            appear: {
                animation: 'fade-in',
            },
        });

    // 绘制仪表盘背景
    chart.annotation().arc({
        top: false,
        start: [0, 1],
        end: [maxValue, 1],
        style: {
            // 底灰色
            stroke: '#CBCBCB',
            lineWidth: 3,
            lineDash: null,
        },
    });

    // 绘制指标
    chart.annotation().arc({
        start: [0, 1],
        end: [scaledValue, 1],
        style: {
            stroke: '#1890FF',
            lineWidth: 3,
            lineDash: null,
        },
    });
    // 绘制指标数字
    //     chart.annotation().text({
    //         position: ['50%', '85%'],
    //         content: '合格率',
    //         style: {
    //             fontSize: 20,
    //             fill: '#545454',
    //             textAlign: 'center',
    //         },
    //     });
    chart.annotation().text({
        position: ['50%', '90%'],
        content: actualValue + '',
        style: {
            fontSize: 10,
            fill: '#545454',
            textAlign: 'center',
        },
        offsetY: 15,
    });

    chart.render();
}
