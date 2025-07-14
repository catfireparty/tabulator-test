import { PercentPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { faker } from '@faker-js/faker';
import { ButtonModule } from 'primeng/button';
import { Popover, PopoverModule } from 'primeng/popover';
import { DataTreeModule, EditModule, FormatModule, InteractionModule, SortModule, Tabulator } from 'tabulator-tables';

Tabulator.registerModule([FormatModule, EditModule]);

@Component({
  selector: 'wibble',
  template: `<i>todo</i>`,
  imports: [],
})
export class WibbleComponent {}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [WibbleComponent, ButtonModule, PopoverModule],
  providers: [PercentPipe],
})
export class App {
  readonly percentPipe = inject(PercentPipe);

  @ViewChild('menu') menu!: Popover;

  constructor() {
    Tabulator.registerModule([FormatModule, EditModule, SortModule, DataTreeModule, InteractionModule]);
  }

  wibble(inst_id: string, row: string) {
    console.log('wibble', inst_id);
    if (this.menu) {
      this.menu.toggle({ target: document.getElementById(row) });
    }
  }

  ngOnInit() {
    const percentPipe = this.percentPipe;

    const table = new Tabulator('#example-table', {
      height: '500px',
      data: generateRows(),
      dataTree: true,
      dataTreeStartExpanded: [true, false],
      columns: [
        { title: 'Name', field: 'name', width: 160 },
        {
          title: '',
          formatter: (cell) => {
            if (cell.getValue()) {
              return `<i id="row_${cell.getRow().getPosition()}">TODO</i>`;
            } else {
              return '';
            }
          },
          field: 'inst_id',
          width: 40,
          hozAlign: 'center',
          cellClick: (e, cell) => {
            if (cell.getValue()) {
              this.wibble(cell.getValue(), `row_${cell.getRow().getPosition()}`);
            }
          },
        },
        {
          //create column group
          title: 'Weight',
          columns: [
            {
              title: 'Port.',
              field: 'weight_port',
              hozAlign: 'right',
              formatter: function (cell) {
                return percentPipe.transform(cell.getValue()) || '';
              },
              sorter: 'number',
              width: 100,
            },
            {
              title: 'Comp.',
              field: 'weight_comp',
              hozAlign: 'right',
              formatter: function (cell) {
                return percentPipe.transform(cell.getValue()) || '';
              },
              sorter: 'number',
              width: 100,
            },
          ],
        },
      ],
    });
  }
}

const generateRows = () => {
  const root = { name: 'Top Level', weight_port: 1, weight_comp: 1, _children: [] as any[] };
  const treedata = [root];

  root._children.push(
    ...faker.helpers.multiple(
      () => ({
        name: faker.commerce.department(),
        weight_port: faker.number.float({ min: 0, max: 1 }),
        weight_comp: faker.number.float({ min: 0, max: 1 }),
      }),
      { count: 50 }
    )
  );

  for (const child of root._children) {
    // add the holdings rows
    child._children = [
      ...faker.helpers.multiple(
        () => ({
          name: faker.finance.accountName(),
          weight_port: faker.number.float({ min: 0, max: 1 }),
          weight_comp: faker.number.float({ min: 0, max: 1 }),
          inst_id: faker.finance.accountNumber(),
        }),
        { count: 50 }
      ),
    ];
  }

  return treedata;
};
