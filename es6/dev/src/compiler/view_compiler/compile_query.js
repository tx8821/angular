import { isPresent, isBlank } from 'angular2/src/facade/lang';
import { ListWrapper } from 'angular2/src/facade/collection';
import * as o from '../output/output_ast';
import { Identifiers } from '../identifiers';
import { getPropertyInView } from './util';
class ViewQueryValues {
    constructor(view, values) {
        this.view = view;
        this.values = values;
    }
}
export class CompileQuery {
    constructor(meta, queryList, ownerDirectiveExpression, view) {
        this.meta = meta;
        this.queryList = queryList;
        this.ownerDirectiveExpression = ownerDirectiveExpression;
        this.view = view;
        this._values = new ViewQueryValues(view, []);
    }
    addValue(value, view) {
        var currentView = view;
        var elPath = [];
        var viewPath = [];
        while (isPresent(currentView) && currentView !== this.view) {
            var parentEl = currentView.declarationElement;
            elPath.unshift(parentEl);
            currentView = parentEl.view;
            viewPath.push(currentView);
        }
        var queryListForDirtyExpr = getPropertyInView(this.queryList, viewPath);
        var viewValues = this._values;
        elPath.forEach((el) => {
            var last = viewValues.values.length > 0 ? viewValues.values[viewValues.values.length - 1] : null;
            if (last instanceof ViewQueryValues && last.view === el.embeddedView) {
                viewValues = last;
            }
            else {
                var newViewValues = new ViewQueryValues(el.embeddedView, []);
                viewValues.values.push(newViewValues);
                viewValues = newViewValues;
            }
        });
        viewValues.values.push(value);
        if (elPath.length > 0) {
            view.dirtyParentQueriesMethod.addStmt(queryListForDirtyExpr.callMethod('setDirty', []).toStmt());
        }
    }
    afterChildren(targetMethod) {
        var values = createQueryValues(this._values);
        var updateStmts = [this.queryList.callMethod('reset', [o.literalArr(values)]).toStmt()];
        if (isPresent(this.ownerDirectiveExpression)) {
            var valueExpr = this.meta.first ? this.queryList.prop('first') : this.queryList;
            updateStmts.push(this.ownerDirectiveExpression.prop(this.meta.propertyName).set(valueExpr).toStmt());
        }
        if (!this.meta.first) {
            updateStmts.push(this.queryList.callMethod('notifyOnChanges', []).toStmt());
        }
        targetMethod.addStmt(new o.IfStmt(this.queryList.prop('dirty'), updateStmts));
    }
}
function createQueryValues(viewValues) {
    return ListWrapper.flatten(viewValues.values.map((entry) => {
        if (entry instanceof ViewQueryValues) {
            return mapNestedViews(entry.view.declarationElement.getOrCreateAppElement(), entry.view, createQueryValues(entry));
        }
        else {
            return entry;
        }
    }));
}
function mapNestedViews(declarationAppElement, view, expressions) {
    var adjustedExpressions = expressions.map((expr) => {
        return o.replaceVarInExpression(o.THIS_EXPR.name, o.variable('nestedView'), expr);
    });
    return declarationAppElement.callMethod('mapNestedViews', [
        o.variable(view.className),
        o.fn([new o.FnParam('nestedView', view.classType)], [new o.ReturnStatement(o.literalArr(adjustedExpressions))])
    ]);
}
export function createQueryList(query, directiveInstance, propertyName, compileView) {
    compileView.fields.push(new o.ClassField(propertyName, o.importType(Identifiers.QueryList), [o.StmtModifier.Private]));
    var expr = o.THIS_EXPR.prop(propertyName);
    compileView.createMethod.addStmt(o.THIS_EXPR.prop(propertyName)
        .set(o.importExpr(Identifiers.QueryList).instantiate([]))
        .toStmt());
    return expr;
}
export function addQueryToTokenMap(map, query) {
    query.meta.selectors.forEach((selector) => {
        var entry = map.get(selector);
        if (isBlank(entry)) {
            entry = [];
            map.add(selector, entry);
        }
        entry.push(query);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9xdWVyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtdlNiN3k1NW0udG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci92aWV3X2NvbXBpbGVyL2NvbXBpbGVfcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLE1BQU0sMEJBQTBCO09BQ3BELEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0NBQWdDO09BRW5ELEtBQUssQ0FBQyxNQUFNLHNCQUFzQjtPQUNsQyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQjtPQVduQyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sUUFBUTtBQUV4QztJQUNFLFlBQW1CLElBQWlCLEVBQVMsTUFBNkM7UUFBdkUsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQXVDO0lBQUcsQ0FBQztBQUNoRyxDQUFDO0FBRUQ7SUFHRSxZQUFtQixJQUEwQixFQUFTLFNBQXVCLEVBQzFELHdCQUFzQyxFQUFTLElBQWlCO1FBRGhFLFNBQUksR0FBSixJQUFJLENBQXNCO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUMxRCw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQWM7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFhO1FBQ2pGLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBbUIsRUFBRSxJQUFpQjtRQUM3QyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxNQUFNLEdBQXFCLEVBQUUsQ0FBQztRQUNsQyxJQUFJLFFBQVEsR0FBa0IsRUFBRSxDQUFDO1FBQ2pDLE9BQU8sU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLFdBQVcsS0FBSyxJQUFJLENBQUMsSUFBSSxF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QUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuXG5pbXBvcnQgKiBhcyBvIGZyb20gJy4uL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7SWRlbnRpZmllcnN9IGZyb20gJy4uL2lkZW50aWZpZXJzJztcblxuaW1wb3J0IHtcbiAgQ29tcGlsZVF1ZXJ5TWV0YWRhdGEsXG4gIENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEsXG4gIENvbXBpbGVUb2tlbk1hcFxufSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcblxuaW1wb3J0IHtDb21waWxlVmlld30gZnJvbSAnLi9jb21waWxlX3ZpZXcnO1xuaW1wb3J0IHtDb21waWxlRWxlbWVudH0gZnJvbSAnLi9jb21waWxlX2VsZW1lbnQnO1xuaW1wb3J0IHtDb21waWxlTWV0aG9kfSBmcm9tICcuL2NvbXBpbGVfbWV0aG9kJztcbmltcG9ydCB7Z2V0UHJvcGVydHlJblZpZXd9IGZyb20gJy4vdXRpbCc7XG5cbmNsYXNzIFZpZXdRdWVyeVZhbHVlcyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2aWV3OiBDb21waWxlVmlldywgcHVibGljIHZhbHVlczogQXJyYXk8by5FeHByZXNzaW9uIHwgVmlld1F1ZXJ5VmFsdWVzPikge31cbn1cblxuZXhwb3J0IGNsYXNzIENvbXBpbGVRdWVyeSB7XG4gIHByaXZhdGUgX3ZhbHVlczogVmlld1F1ZXJ5VmFsdWVzO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtZXRhOiBDb21waWxlUXVlcnlNZXRhZGF0YSwgcHVibGljIHF1ZXJ5TGlzdDogby5FeHByZXNzaW9uLFxuICAgICAgICAgICAgICBwdWJsaWMgb3duZXJEaXJlY3RpdmVFeHByZXNzaW9uOiBvLkV4cHJlc3Npb24sIHB1YmxpYyB2aWV3OiBDb21waWxlVmlldykge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ldyBWaWV3UXVlcnlWYWx1ZXModmlldywgW10pO1xuICB9XG5cbiAgYWRkVmFsdWUodmFsdWU6IG8uRXhwcmVzc2lvbiwgdmlldzogQ29tcGlsZVZpZXcpIHtcbiAgICB2YXIgY3VycmVudFZpZXcgPSB2aWV3O1xuICAgIHZhciBlbFBhdGg6IENvbXBpbGVFbGVtZW50W10gPSBbXTtcbiAgICB2YXIgdmlld1BhdGg6IENvbXBpbGVWaWV3W10gPSBbXTtcbiAgICB3aGlsZSAoaXNQcmVzZW50KGN1cnJlbnRWaWV3KSAmJiBjdXJyZW50VmlldyAhPT0gdGhpcy52aWV3KSB7XG4gICAgICB2YXIgcGFyZW50RWwgPSBjdXJyZW50Vmlldy5kZWNsYXJhdGlvbkVsZW1lbnQ7XG4gICAgICBlbFBhdGgudW5zaGlmdChwYXJlbnRFbCk7XG4gICAgICBjdXJyZW50VmlldyA9IHBhcmVudEVsLnZpZXc7XG4gICAgICB2aWV3UGF0aC5wdXNoKGN1cnJlbnRWaWV3KTtcbiAgICB9XG4gICAgdmFyIHF1ZXJ5TGlzdEZvckRpcnR5RXhwciA9IGdldFByb3BlcnR5SW5WaWV3KHRoaXMucXVlcnlMaXN0LCB2aWV3UGF0aCk7XG5cbiAgICB2YXIgdmlld1ZhbHVlcyA9IHRoaXMuX3ZhbHVlcztcbiAgICBlbFBhdGguZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgIHZhciBsYXN0ID1cbiAgICAgICAgICB2aWV3VmFsdWVzLnZhbHVlcy5sZW5ndGggPiAwID8gdmlld1ZhbHVlcy52YWx1ZXNbdmlld1ZhbHVlcy52YWx1ZXMubGVuZ3RoIC0gMV0gOiBudWxsO1xuICAgICAgaWYgKGxhc3QgaW5zdGFuY2VvZiBWaWV3UXVlcnlWYWx1ZXMgJiYgbGFzdC52aWV3ID09PSBlbC5lbWJlZGRlZFZpZXcpIHtcbiAgICAgICAgdmlld1ZhbHVlcyA9IGxhc3Q7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgbmV3Vmlld1ZhbHVlcyA9IG5ldyBWaWV3UXVlcnlWYWx1ZXMoZWwuZW1iZWRkZWRWaWV3LCBbXSk7XG4gICAgICAgIHZpZXdWYWx1ZXMudmFsdWVzLnB1c2gobmV3Vmlld1ZhbHVlcyk7XG4gICAgICAgIHZpZXdWYWx1ZXMgPSBuZXdWaWV3VmFsdWVzO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHZpZXdWYWx1ZXMudmFsdWVzLnB1c2godmFsdWUpO1xuXG4gICAgaWYgKGVsUGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICB2aWV3LmRpcnR5UGFyZW50UXVlcmllc01ldGhvZC5hZGRTdG10KFxuICAgICAgICAgIHF1ZXJ5TGlzdEZvckRpcnR5RXhwci5jYWxsTWV0aG9kKCdzZXREaXJ0eScsIFtdKS50b1N0bXQoKSk7XG4gICAgfVxuICB9XG5cbiAgYWZ0ZXJDaGlsZHJlbih0YXJnZXRNZXRob2Q6IENvbXBpbGVNZXRob2QpIHtcbiAgICB2YXIgdmFsdWVzID0gY3JlYXRlUXVlcnlWYWx1ZXModGhpcy5fdmFsdWVzKTtcbiAgICB2YXIgdXBkYXRlU3RtdHMgPSBbdGhpcy5xdWVyeUxpc3QuY2FsbE1ldGhvZCgncmVzZXQnLCBbby5saXRlcmFsQXJyKHZhbHVlcyldKS50b1N0bXQoKV07XG4gICAgaWYgKGlzUHJlc2VudCh0aGlzLm93bmVyRGlyZWN0aXZlRXhwcmVzc2lvbikpIHtcbiAgICAgIHZhciB2YWx1ZUV4cHIgPSB0aGlzLm1ldGEuZmlyc3QgPyB0aGlzLnF1ZXJ5TGlzdC5wcm9wKCdmaXJzdCcpIDogdGhpcy5xdWVyeUxpc3Q7XG4gICAgICB1cGRhdGVTdG10cy5wdXNoKFxuICAgICAgICAgIHRoaXMub3duZXJEaXJlY3RpdmVFeHByZXNzaW9uLnByb3AodGhpcy5tZXRhLnByb3BlcnR5TmFtZSkuc2V0KHZhbHVlRXhwcikudG9TdG10KCkpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMubWV0YS5maXJzdCkge1xuICAgICAgdXBkYXRlU3RtdHMucHVzaCh0aGlzLnF1ZXJ5TGlzdC5jYWxsTWV0aG9kKCdub3RpZnlPbkNoYW5nZXMnLCBbXSkudG9TdG10KCkpO1xuICAgIH1cbiAgICB0YXJnZXRNZXRob2QuYWRkU3RtdChuZXcgby5JZlN0bXQodGhpcy5xdWVyeUxpc3QucHJvcCgnZGlydHknKSwgdXBkYXRlU3RtdHMpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVRdWVyeVZhbHVlcyh2aWV3VmFsdWVzOiBWaWV3UXVlcnlWYWx1ZXMpOiBvLkV4cHJlc3Npb25bXSB7XG4gIHJldHVybiBMaXN0V3JhcHBlci5mbGF0dGVuKHZpZXdWYWx1ZXMudmFsdWVzLm1hcCgoZW50cnkpID0+IHtcbiAgICBpZiAoZW50cnkgaW5zdGFuY2VvZiBWaWV3UXVlcnlWYWx1ZXMpIHtcbiAgICAgIHJldHVybiBtYXBOZXN0ZWRWaWV3cyhlbnRyeS52aWV3LmRlY2xhcmF0aW9uRWxlbWVudC5nZXRPckNyZWF0ZUFwcEVsZW1lbnQoKSwgZW50cnkudmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcmVhdGVRdWVyeVZhbHVlcyhlbnRyeSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPG8uRXhwcmVzc2lvbj5lbnRyeTtcbiAgICB9XG4gIH0pKTtcbn1cblxuZnVuY3Rpb24gbWFwTmVzdGVkVmlld3MoZGVjbGFyYXRpb25BcHBFbGVtZW50OiBvLkV4cHJlc3Npb24sIHZpZXc6IENvbXBpbGVWaWV3LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwcmVzc2lvbnM6IG8uRXhwcmVzc2lvbltdKTogby5FeHByZXNzaW9uIHtcbiAgdmFyIGFkanVzdGVkRXhwcmVzc2lvbnM6IG8uRXhwcmVzc2lvbltdID0gZXhwcmVzc2lvbnMubWFwKChleHByKSA9PiB7XG4gICAgcmV0dXJuIG8ucmVwbGFjZVZhckluRXhwcmVzc2lvbihvLlRISVNfRVhQUi5uYW1lLCBvLnZhcmlhYmxlKCduZXN0ZWRWaWV3JyksIGV4cHIpO1xuICB9KTtcbiAgcmV0dXJuIGRlY2xhcmF0aW9uQXBwRWxlbWVudC5jYWxsTWV0aG9kKCdtYXBOZXN0ZWRWaWV3cycsIFtcbiAgICBvLnZhcmlhYmxlKHZpZXcuY2xhc3NOYW1lKSxcbiAgICBvLmZuKFtuZXcgby5GblBhcmFtKCduZXN0ZWRWaWV3Jywgdmlldy5jbGFzc1R5cGUpXSxcbiAgICAgICAgIFtuZXcgby5SZXR1cm5TdGF0ZW1lbnQoby5saXRlcmFsQXJyKGFkanVzdGVkRXhwcmVzc2lvbnMpKV0pXG4gIF0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUXVlcnlMaXN0KHF1ZXJ5OiBDb21waWxlUXVlcnlNZXRhZGF0YSwgZGlyZWN0aXZlSW5zdGFuY2U6IG8uRXhwcmVzc2lvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lOiBzdHJpbmcsIGNvbXBpbGVWaWV3OiBDb21waWxlVmlldyk6IG8uRXhwcmVzc2lvbiB7XG4gIGNvbXBpbGVWaWV3LmZpZWxkcy5wdXNoKG5ldyBvLkNsYXNzRmllbGQocHJvcGVydHlOYW1lLCBvLmltcG9ydFR5cGUoSWRlbnRpZmllcnMuUXVlcnlMaXN0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbby5TdG10TW9kaWZpZXIuUHJpdmF0ZV0pKTtcbiAgdmFyIGV4cHIgPSBvLlRISVNfRVhQUi5wcm9wKHByb3BlcnR5TmFtZSk7XG4gIGNvbXBpbGVWaWV3LmNyZWF0ZU1ldGhvZC5hZGRTdG10KG8uVEhJU19FWFBSLnByb3AocHJvcGVydHlOYW1lKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNldChvLmltcG9ydEV4cHIoSWRlbnRpZmllcnMuUXVlcnlMaXN0KS5pbnN0YW50aWF0ZShbXSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudG9TdG10KCkpO1xuICByZXR1cm4gZXhwcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFF1ZXJ5VG9Ub2tlbk1hcChtYXA6IENvbXBpbGVUb2tlbk1hcDxDb21waWxlUXVlcnlbXT4sIHF1ZXJ5OiBDb21waWxlUXVlcnkpIHtcbiAgcXVlcnkubWV0YS5zZWxlY3RvcnMuZm9yRWFjaCgoc2VsZWN0b3IpID0+IHtcbiAgICB2YXIgZW50cnkgPSBtYXAuZ2V0KHNlbGVjdG9yKTtcbiAgICBpZiAoaXNCbGFuayhlbnRyeSkpIHtcbiAgICAgIGVudHJ5ID0gW107XG4gICAgICBtYXAuYWRkKHNlbGVjdG9yLCBlbnRyeSk7XG4gICAgfVxuICAgIGVudHJ5LnB1c2gocXVlcnkpO1xuICB9KTtcbn1cbiJdfQ==