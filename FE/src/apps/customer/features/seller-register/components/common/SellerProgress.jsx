export default function SellerProgress({ progress }) {
    if (!progress) return null;

    return (
        <div>
            <div>Step: {progress.currentStep} / {progress.totalSteps}</div>
            <div>Completed: {progress.completedSteps}</div>
        </div>
    );
}