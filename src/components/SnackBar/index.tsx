function SnackBar({ message }: { message: string }) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-40 mb-12 rounded-md border border-b-0 bg-white p-4 text-center text-xsm font-medium capitalize sm:text-sm">
            {message}
        </div>
    )
}

export default SnackBar
