import { ActivatedRoute } from "@angular/router";
import { DataStateChangeEvent } from "@progress/kendo-angular-grid";
import { Filter, QueryOptions } from "src/models/query-options";

export function getQueryOptions(state: DataStateChangeEvent, route: ActivatedRoute): QueryOptions {
    let queryOptions: QueryOptions = {
        skip: state.skip,
        take: state.take,
        filters: [],
        siteOptions: {
          siteRef: 'default',
          withSubSites: false
        }
      };
  
      if (state.filter && state.filter.filters.length > 0) {
        queryOptions = {
          ...queryOptions,
          filters: [
            ...(queryOptions.filters as Filter[]),
            ...state.filter!.filters.map((item: any) => {
              return {
                field: item.field,
                operator: item.operator,
                value: (typeof item.value === 'object' ? (Array.isArray(item.value) ? item.value.map((i: any) => i.getTime()) : item.value.getTime()) : item.value).toString(),
                type: typeof item.value === 'object' ? (Array.isArray(item.value) ? 'array' : 'date') : typeof item.value
              };
            })
          ]
        }
      } else {
        queryOptions.filters = [];
      }
  
      if (state.sort && state.sort?.length > 0) {
        if (state.sort![0].dir) {
          queryOptions = {
            ...queryOptions,
            sort: {
              dir: state.sort![0].dir!,
              field: state.sort![0].field
            }
          };
        } else {
          delete queryOptions['sort'];
        }
      }

      return queryOptions;
}