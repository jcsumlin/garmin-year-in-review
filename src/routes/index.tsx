import Header from '@/components/report/Header'
import ReportWrapper from '@/components/report/ReportWrapper'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { useExportFile } from '@/providers/ExportFileProvider'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import JSZip from 'jszip'
import { Upload } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { setData, setFiles } = useExportFile()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/zip' && !file.name.endsWith('.zip')) {
      setError('Please upload a valid ZIP file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);

      // Find all JSON files in the zip
      const jsonFiles = Object.keys(contents.files).filter(
        filename => filename.endsWith('.json') && !contents.files[filename].dir
      );

      if (jsonFiles.length === 0) {
        throw new Error('No JSON files found in ZIP');
      }

      // Store data in route context instead of navigation state
      setData(contents.files)
      setFiles(jsonFiles)

      // Navigate to /review (no state needed)
      navigate({ to: '/review' });
      setLoading(false);
    } catch (err: unknown) {
      console.error('Error:', err);
      const message = err instanceof Error ? err.message : 'Failed to process ZIP file. Please ensure it\'s a valid Garmin export.';
      setError(message);
      setLoading(false);
    }
  };
  return (
    <ReportWrapper>
      <Header />
      <Card className="mb-6 border-2 border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Your Data
          </CardTitle>
          <CardDescription>
            Upload the ZIP file exported from <a className="text-blue-500" href='https://www.garmin.com/en-US/account/datamanagement/'>Garmin Connect</a> export data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="border-2 border-gray-300 border-dashed rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload
              </p>
              <p className="text-xs text-gray-500">ZIP files only</p>
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".zip"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          {loading && (
            <p className="text-center text-blue-600 mt-4">Processing ZIP file...</p>
          )}
          {error && (
            <p className="text-center text-red-600 mt-4 text-sm">{error}</p>
          )}
        </CardContent>
      </Card>

    </ReportWrapper>
  )
}
