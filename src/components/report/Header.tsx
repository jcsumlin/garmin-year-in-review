
export default function Header() {
    return (
        <div className="text-center mb-8 pt-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your {new Date().getFullYear()} Wrapped</h1>
            <p className='text-lg text-gray-600'>Lets see how you stacked up!</p>
        </div>
    )
}
