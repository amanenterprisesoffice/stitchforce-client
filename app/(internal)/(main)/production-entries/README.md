# StitchForce Production Entries UI

## Files
- `page.tsx`: production entries list, search, filters, details/edit/delete.
- `new/page.tsx`: dedicated multi-worker entry page. Bundle, style, and operation remain selected after a successful create; worker, quantity and remarks reset for the next worker.
- `schema.ts`: API-facing types and formatting helpers.
- `components/*`: header, list filters/table, edit/details/delete dialogs, and the selected-bundle/operation entries table.

## Route placement
Place this folder under your existing App Router organization route, e.g.
`app/(dashboard)/production-entries/`
so the list is `/production-entries` and the create workflow is `/production-entries/new`.
Adjust relative imports only if your route nesting differs.

## API behavior
All requests use `user.organization_id` and your existing authenticated `useFetch` hook.
The create payload sends `bundle_id`, `worker_id`, `style_operation_id`, `quantity`, `production_date`, and `remarks`. It deliberately does not send `rate_per_piece` or `total_amount`.
The selected style is derived from the selected bundle, and operations are fetched from that style's `/operations` endpoint.
The UI calculates a preview using the selected operation rate, but the backend remains authoritative.
Bundle remaining quantity is calculated from the bundle quantity minus all non-deleted entries returned by the list endpoint for that bundle.

## Important backend contract mismatch
Your prose says PUT can update `style_operation_id`, but the Go `UpdateProductionEntry` struct you supplied does not contain `StyleOperationID`. Therefore the edit dialog retains the existing bundle and operation and only edits worker, quantity, date, and remarks. If you add `StyleOperationID` to the Go update request later, update the edit dialog and payload accordingly.

## Integration assumptions to verify
- The list endpoints return either an array or an object with `data`, `entries`, `production_entries`, `workers`, `garment_workers`, `bundles`, `styles`, or `operations`.
- Worker active status may be `is_active`, `active`, or `status`; the UI excludes explicit false/inactive values.
- `rate_per_piece` and `total_amount` are represented in paise, matching the rate formatting in your supplied style operations page. If your API returns rupees instead, remove the `/ 100` conversion in `formatMoney`.
- `useFetch` supports the `auto: false`, `refetch`, `payload`, `onSuccess`, `onError` pattern shown in your supplied pages. If it uses a different callback signature, adapt those calls to your hook.
- Ensure the list endpoint excludes soft-deleted entries; if it does not, filter `deleted_at` in the client before computing bundle progress.
