import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

import { AbbreviationService } from '../../services/abbreviation.service';
import { ExportService } from '../../services/export.service';
import { NotificationService } from '../../services/notification.service';
import type { Abbreviation, PaginatedResponse } from '../../interfaces';

@Component({
    selector: 'app-pdf-export-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressBarModule,
        MatSelectModule,
    ],
    templateUrl: './pdf-export-modal.component.html',
    styleUrls: ['./pdf-export-modal.component.scss']
})
export class PdfExportModalComponent implements OnInit {
    private abbreviationService = inject(AbbreviationService);
    private exportService = inject(ExportService);
    private notificationService = inject(NotificationService);
    private dialogRef = inject(MatDialogRef<PdfExportModalComponent>);

    // Component state
    isLoading = false;
    searchTerm = '';
    selectedCategory = '';

    // Data
    abbreviations: Abbreviation[] = [];
    categories: string[] = [];
    filteredAbbreviations: Abbreviation[] = [];
    selectedAbbreviationIds: number[] = [];

    ngOnInit(): void {
        this.loadData();
    }

    private async loadData(): Promise<void> {
        this.isLoading = true;
        try {
            // Load abbreviations
            const abbreviationsResponse = await this.abbreviationService.getAbbreviations().toPromise();
            if (abbreviationsResponse?.data?.data) {
                this.abbreviations = abbreviationsResponse.data.data;
                this.filteredAbbreviations = [...this.abbreviations];
            }

            // Load categories
            const categoriesResponse = await this.abbreviationService.getCategories().toPromise();
            if (categoriesResponse?.data) {
                this.categories = categoriesResponse.data;
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.notificationService.showError('Greška pri učitavanju podataka');
        } finally {
            this.isLoading = false;
        }
    }

    onSearchChange(): void {
        this.filterAbbreviations();
    }

    onCategoryChange(): void {
        this.filterAbbreviations();
    }

    private filterAbbreviations(): void {
        let filtered = [...this.abbreviations];

        // Filter by search term
        if (this.searchTerm.trim()) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(abbr =>
                abbr.abbreviation.toLowerCase().includes(searchLower) ||
                abbr.meaning.toLowerCase().includes(searchLower)
            );
        }

        // Filter by category
        if (this.selectedCategory) {
            filtered = filtered.filter(abbr => abbr.category === this.selectedCategory);
        }

        this.filteredAbbreviations = filtered;
    }

    toggleAbbreviationSelection(id: number): void {
        const index = this.selectedAbbreviationIds.indexOf(id);
        if (index > -1) {
            this.selectedAbbreviationIds.splice(index, 1);
        } else {
            this.selectedAbbreviationIds.push(id);
        }
    }

    isAbbreviationSelected(id: number): boolean {
        return this.selectedAbbreviationIds.includes(id);
    }

    toggleSelectAll(): void {
        if (this.isAllSelected()) {
            this.selectedAbbreviationIds = [];
        } else {
            this.selectedAbbreviationIds = this.filteredAbbreviations.map(abbr => abbr.id);
        }
    }

    isAllSelected(): boolean {
        return this.filteredAbbreviations.length > 0 &&
            this.selectedAbbreviationIds.length === this.filteredAbbreviations.length;
    }

    isPartiallySelected(): boolean {
        return this.selectedAbbreviationIds.length > 0 &&
            this.selectedAbbreviationIds.length < this.filteredAbbreviations.length;
    }

    trackByAbbreviationId(index: number, abbreviation: Abbreviation): number {
        return abbreviation.id;
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    async onExport(): Promise<void> {
        if (this.selectedAbbreviationIds.length === 0) {
            this.notificationService.showWarning('Molimo odaberite barem jednu skraćenicu');
            return;
        }

        this.isLoading = true;
        try {
            const options = {
                format: 'pdf' as const,
                abbreviation_ids: this.selectedAbbreviationIds
            };

            const blob = await this.exportService.exportToPDF(options).toPromise();
            if (blob) {
                const filename = this.exportService.generateFilename('pdf');
                this.exportService.downloadBlob(blob, filename);
                this.notificationService.showSuccess(`PDF je uspješno kreiran s ${this.selectedAbbreviationIds.length} skraćenica!`);
                this.dialogRef.close();
            }
        } catch (error) {
            console.error('Export error:', error);
            this.notificationService.showError('Greška pri kreiranju PDF-a');
        } finally {
            this.isLoading = false;
        }
    }
}
