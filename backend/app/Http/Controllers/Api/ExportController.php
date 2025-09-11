<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExportPdfRequest;
use App\Models\Abbreviation;
use Barryvdh\DomPDF\Facade\Pdf;
use Symfony\Component\HttpFoundation\Response;

class ExportController extends Controller
{
    /**
     * Export abbreviations to PDF
     */
    public function exportPdf(ExportPdfRequest $request): Response
    {
        // Build query
        $query = Abbreviation::with(['user', 'votes', 'comments.user']);

        // Filter by specific IDs if provided
        if ($request->has('abbreviation_ids') && ! empty($request->abbreviation_ids)) {
            $query->whereIn('id', $request->abbreviation_ids);
        } else {
            // Apply search filters
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('abbreviation', 'like', "%$search%")
                        ->orWhere('meaning', 'like', "%$search%")
                        ->orWhere('description', 'like', "%$search%");
                });
            }

            if ($request->filled('category')) {
                $query->where('category', $request->category);
            }
        }

        $abbreviations = $query->orderBy('abbreviation')->get();

        if ($abbreviations->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No abbreviations found for export',
            ], 404);
        }

        try {
            $format = $request->get('format', 'simple');
            $viewName = $format === 'detailed' ? 'pdf.abbreviations-detailed' : 'pdf.abbreviations-simple';

            // Generate PDF
            $pdf = Pdf::loadView($viewName, [
                'abbreviations' => $abbreviations,
                'exportDate' => now()->format('d.m.Y H:i'),
                'totalCount' => $abbreviations->count(),
                'filters' => [
                    'search' => $request->search,
                    'category' => $request->category,
                ],
            ]);

            $filename = 'abbreviations_' . now()->format('Y-m-d_H-i-s') . '.pdf';

            return $pdf->download($filename);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to generate PDF: ' . $e->getMessage(),
            ], 500);
        }
    }
}
